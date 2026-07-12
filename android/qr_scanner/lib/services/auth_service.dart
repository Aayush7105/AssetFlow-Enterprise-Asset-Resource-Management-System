import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:qr_scanner/models/user.dart';
import 'package:qr_scanner/services/api_service.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'auth_user';

  String? _token;
  User? _currentUser;

  String? get token => _token;
  User? get currentUser => _currentUser;
  bool get isLoggedIn => _token != null && _currentUser != null;

  /// Try to restore a saved session from SharedPreferences.
  Future<bool> tryRestoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final savedToken = prefs.getString(_tokenKey);
    final savedUser = prefs.getString(_userKey);

    if (savedToken != null && savedUser != null) {
      _token = savedToken;
      _currentUser = User.fromJson(jsonDecode(savedUser));
      return true;
    }
    return false;
  }

  /// Login with email and password.
  Future<User> login(String email, String password) async {
    final response = await ApiService.instance.post(
      '/auth/login',
      body: {'email': email, 'password': password},
      authenticated: false,
    );

    if (response['success'] != true) {
      throw Exception(response['message'] ?? 'Login failed');
    }

    _token = response['token'];
    _currentUser = User.fromJson(response['data']);

    // Persist session
    final prefs = await SharedPreferences.getInstance();
    final tokenToSave = _token;
    if (tokenToSave != null) {
      await prefs.setString(_tokenKey, tokenToSave);
    }
    
    final userToSave = _currentUser;
    if (userToSave != null) {
      await prefs.setString(_userKey, jsonEncode(userToSave.toJson()));
      return userToSave;
    }
    
    throw Exception('Failed to parse user data');
  }

  /// Clear stored session and log out.
  Future<void> logout() async {
    _token = null;
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
}
