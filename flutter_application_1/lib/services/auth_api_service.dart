import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'session_service.dart';

class AuthApiService {
  static const String _baseUrl =
      'https://digital-trust-backend.onrender.com';

  /// Authenticate user with backend after Firebase login
  static Future<bool> authenticateWithBackend() async {
    try {
      final user = FirebaseAuth.instance.currentUser;

      if (user == null) {
        throw Exception('No Firebase user logged in');
      }

      // Get Firebase ID token
      final idToken = await user.getIdToken();

      final response = await http.post(
        Uri.parse('$_baseUrl/api/auth'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'idToken': idToken,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Backend auth failed: ${response.body}');
      }

      final data = jsonDecode(response.body);

      final jwt = data['token'];
      if (jwt == null) {
        throw Exception('JWT missing in backend response');
      }

      // Save JWT securely
      await SessionService().saveJwt(jwt);

      return true;
    } catch (e) {
      print('AuthApiService error: $e');
      return false;
    }
  }
}
