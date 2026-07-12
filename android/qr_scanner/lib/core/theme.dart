import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  AppTheme._();

  // Dark Mode colors based on web app globals.css
  static const Color _darkSurface = Color(0xFF09090B); // var(--background)
  static const Color _darkCard = Color(0xFF18181B);    // var(--card)
  static const Color _border = Color(0xFF27272A);      // var(--border)
  static const Color _primary = Color(0xFFFAFAFA);     // var(--primary)
  static const Color _primaryForeground = Color(0xFF09090B); // var(--primary-foreground)
  static const Color _mutedText = Color(0xFFA1A1AA);   // var(--muted-foreground)

  static ThemeData get darkTheme {
    final colorScheme = const ColorScheme.dark(
      primary: _primary,
      onPrimary: _primaryForeground,
      surface: _darkSurface,
      onSurface: _primary,
      secondary: Color(0xFF27272A),
      onSecondary: _primary,
      error: Color(0xFFEF4444),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: _darkSurface,
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      ),
      cardTheme: CardThemeData(
        color: _darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(
            color: _border,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: _darkCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(
            color: _border,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(
            color: _border,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(
            color: colorScheme.primary,
            width: 2,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        labelStyle: const TextStyle(
          color: _mutedText,
        ),
        hintStyle: const TextStyle(
          color: _mutedText,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _primary,
          foregroundColor: _primaryForeground,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: _darkSurface,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: _primary,
        ),
        iconTheme: const IconThemeData(color: _primary),
      ),
    );
  }
}
