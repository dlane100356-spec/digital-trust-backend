import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_application_1/api_service.dart';

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Returns true if user is fully authenticated
  static Future<bool> isAuthenticated() async {
    final firebaseUser = _auth.currentUser;
    final jwt = await ApiService.getJwt();

    return firebaseUser != null && jwt != null;
  }

  /// Logout user completely
  static Future<void> logout() async {
    await _auth.signOut();
    await ApiService.saveJwt('');
  }
}
