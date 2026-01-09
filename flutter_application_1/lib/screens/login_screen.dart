import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../services/auth_api_service.dart';
import '../services/session_service.dart';
import '../auth/phone_login.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _loading = false;
  String? _error;

  Future<void> _handleFirebaseLogin(UserCredential credential) async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final idToken = await credential.user!.getIdToken();
      final response = await AuthApiService().exchangeToken(idToken);

      await SessionService().saveJwt(response['token']);

      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } catch (e) {
      setState(() {
        _error = 'Login failed';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _emailLogin() async {
    try {
      final credential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      await _handleFirebaseLogin(credential);
    } catch (e) {
      setState(() {
        _error = 'Invalid email or password';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Digital Trust Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            if (_error != null)
              Text(_error!, style: const TextStyle(color: Colors.red)),

            const SizedBox(height: 16),

            // PHONE LOGIN
            ElevatedButton(
              onPressed: _loading
                  ? null
                  : () async {
                      final credential =
                          await Navigator.push<UserCredential>(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const PhoneLoginScreen(),
                        ),
                      );

                      if (credential != null) {
                        await _handleFirebaseLogin(credential);
                      }
                    },
              child: const Text('Login with Phone'),
            ),

            const Divider(height: 40),

            // EMAIL LOGIN
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _loading ? null : _emailLogin,
              child: const Text('Login with Email'),
            ),

            if (_loading)
              const Padding(
                padding: EdgeInsets.only(top: 20),
                child: CircularProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}
