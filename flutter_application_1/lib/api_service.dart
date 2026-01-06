import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ApiService {
  static const _storage = FlutterSecureStorage();
  static const _baseUrl = 'http://10.0.2.2:5000'; // Android emulator

  // Save JWT
  static Future<void> saveJwt(String token) async {
    await _storage.write(key: 'jwt', value: token);
  }

  // Read JWT
  static Future<String?> getJwt() async {
    return await _storage.read(key: 'jwt');
  }

  // Exchange Firebase user for backend JWT
  static Future<bool> loginWithFirebase() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return false;

    final res = await http.post(
      Uri.parse('$_baseUrl/auth/firebase'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'uid': user.uid,
        'phone': user.phoneNumber,
      }),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      await saveJwt(data['token']);
      return true;
    }

    return false;
  }

  // Authorized GET request
  static Future<http.Response> get(String path) async {
    final token = await getJwt();
    return http.get(
      Uri.parse('$_baseUrl$path'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );
  }
}
