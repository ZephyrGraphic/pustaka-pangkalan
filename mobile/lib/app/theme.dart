import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);

class AppTheme {
  // Color Palette: Army Green / Deep Olive Accent + Minimalist Gray & White
  static const Color armyGreen = Color(0xFF3B5836);       // Primary Army Green
  static const Color armyGreenLight = Color(0xFF4E7348);  // Light Army Accent
  static const Color armyGreenDark = Color(0xFF263A22);   // Deep Olive

  // Neutral Palette
  static const Color bgLight = Color(0xFFF7F9F7);         // Minimalist Off-White/Gray
  static const Color cardLight = Colors.white;            // Clean White Surface

  static const Color bgDark = Color(0xFF141714);          // Minimalist Slate Dark
  static const Color cardDark = Color(0xFF1F241F);        // Dark Card Surface

  // Light Theme (Minimalist White & Gray with Army Green Accent)
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: bgLight,
      colorScheme: ColorScheme.light(
        primary: armyGreen,
        secondary: armyGreenLight,
        surface: cardLight,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: bgLight,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Color(0xFF1A1A1A)),
        titleTextStyle: TextStyle(
          color: Color(0xFF1A1A1A),
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardThemeData(
        color: cardLight,
        elevation: 1,
        shadowColor: Colors.black12,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardLight,
        selectedItemColor: armyGreen,
        unselectedItemColor: Color(0xFF8E958D),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }

  // Dark Theme (Minimalist Deep Slate with Army Green Accent)
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDark,
      colorScheme: ColorScheme.dark(
        primary: armyGreenLight,
        secondary: armyGreen,
        surface: cardDark,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: bgDark,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      cardTheme: CardThemeData(
        color: cardDark,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardDark,
        selectedItemColor: armyGreenLight,
        unselectedItemColor: Color(0xFF6B726A),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
