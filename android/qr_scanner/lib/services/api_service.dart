import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:qr_scanner/core/constants.dart';

class ApiService {
  static final ApiService instance = ApiService._();
  ApiService._();

  String? _token;

  void setToken(String? token) {
    _token = token;
  }

  Map<String, String> _headers({bool authenticated = true}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (authenticated && _token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  /// POST request.
  Future<Map<String, dynamic>> post(
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = true,
  }) async {
    final url = Uri.parse('${AppConstants.apiBaseUrl}$path');
    final response = await http.post(
      url,
      headers: _headers(authenticated: authenticated),
      body: body != null ? jsonEncode(body) : null,
    );
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  /// GET request.
  Future<Map<String, dynamic>> get(
    String path, {
    bool authenticated = true,
  }) async {
    final url = Uri.parse('${AppConstants.apiBaseUrl}$path');
    final response = await http.get(
      url,
      headers: _headers(authenticated: authenticated),
    );
    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
