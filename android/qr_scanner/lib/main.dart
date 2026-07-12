import 'package:flutter/material.dart';
import 'package:qr_scanner/core/constants.dart';
import 'package:qr_scanner/core/theme.dart';
import 'package:qr_scanner/models/asset.dart';
import 'package:qr_scanner/services/api_service.dart';
import 'package:qr_scanner/services/auth_service.dart';
import 'package:qr_scanner/screens/login_screen.dart';
import 'package:qr_scanner/screens/home_screen.dart';
import 'package:qr_scanner/screens/scanner_screen.dart';
import 'package:qr_scanner/screens/asset_detail_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AssetFlowApp());
}

class AssetFlowApp extends StatefulWidget {
  const AssetFlowApp({super.key});

  @override
  State<AssetFlowApp> createState() => _AssetFlowAppState();
}

class _AssetFlowAppState extends State<AssetFlowApp> {
  final AuthService _authService = AuthService();
  bool _isCheckingAuth = true;
  bool _isAuthenticated = false;

  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  Future<void> _checkSession() async {
    final restored = await _authService.tryRestoreSession();
    if (restored) {
      ApiService.instance.setToken(_authService.token);
    }
    setState(() {
      _isAuthenticated = restored;
      _isCheckingAuth = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AssetFlow Scanner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: _isCheckingAuth
          ? const Scaffold(
              body: Center(
                child: CircularProgressIndicator(),
              ),
            )
          : (_isAuthenticated
              ? HomeScreen(authService: _authService)
              : LoginScreen(authService: _authService)),
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case AppConstants.loginRoute:
            return MaterialPageRoute(
              builder: (_) => LoginScreen(authService: _authService),
            );
          case AppConstants.homeRoute:
            return MaterialPageRoute(
              builder: (_) => HomeScreen(authService: _authService),
            );
          case AppConstants.scannerRoute:
            return MaterialPageRoute(
              builder: (_) => const ScannerScreen(),
            );
          case AppConstants.assetDetailRoute:
            final asset = settings.arguments as Asset;
            return MaterialPageRoute(
              builder: (_) => AssetDetailScreen(asset: asset),
            );
          default:
            return MaterialPageRoute(
              builder: (_) => LoginScreen(authService: _authService),
            );
        }
      },
    );
  }
}
