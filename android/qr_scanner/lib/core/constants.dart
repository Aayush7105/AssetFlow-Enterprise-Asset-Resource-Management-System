class AppConstants {
  AppConstants._();

  // Change this to your backend's URL.
  // For Android emulator → host machine, use 10.0.2.2
  // For physical device on same Wi-Fi, use your machine's local IP.
  static const String apiBaseUrl = 'http://10.0.2.2:3000/api';

  // Route names
  static const String loginRoute = '/login';
  static const String homeRoute = '/home';
  static const String scannerRoute = '/scanner';
  static const String assetDetailRoute = '/asset-detail';
}
