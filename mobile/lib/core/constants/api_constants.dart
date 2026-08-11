import 'package:flutter/foundation.dart';

class ApiConstants {
  // Production Hosting / Vercel domain URL (Ganti dengan domain hosting Vercel/VPS Anda jika sudah di-deploy)
  static const String productionDomainUrl = 'https://pustaka-pangkalan.vercel.app/api/v1';

  // Base URL otomatis memilih endpoint yang tepat berdasarkan platform & environment
  static String get baseUrl {
    if (kIsWeb) {
      // Pada mode Web lokal, gunakan origin server backend
      return 'http://localhost:3000/api/v1';
    }
    // Pada mode Android APK / Emulator:
    // Gunakan productionDomainUrl jika sudah ter-deploy di server/Vercel, atau 10.0.2.2 untuk Android Emulator lokal.
    return 'http://10.0.2.2:3000/api/v1';
  }

  // Endpoints REST API backend Next.js
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';

  static const String categories = '/categories';
  static const String contents = '/contents';
  static const String search = '/search';

  static const String readingProgress = '/me/reading-progress';
  static const String bookshelf = '/me/bookshelf';
  static const String bookmarks = '/me/bookmarks';
}
