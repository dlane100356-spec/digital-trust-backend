import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SessionService {
  // Singleton pattern
  static final SessionService _instance = SessionService._internal();
  factory SessionService() => _instance;
  SessionService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // Keys
  static const String _jwtKey = 'backend_jwt';

  /// Save JWT received from backend
  Future<void> saveJwt(String token) async {
    await _storage.write(key: _jwtKey, value: token);
  }

  /// Read JWT (returns null if not logged in)
  Future<String?> getJwt() async {
    return await _storage.read(key: _jwtKey);
  }

  /// Check if user is logged in (JWT exists)
  Future<bool> isLoggedIn() async {
    final token = await getJwt();
    return token != null && token.isNotEmpty;
  }

  /// Clear session (logout)
  Future<void> clearSession() async {
    await _storage.delete(key: _jwtKey);
  }
}
