import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/catalog/presentation/search_screen.dart';
import '../features/bookshelf/presentation/bookshelf_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/providers/auth_provider.dart';
import '../features/admin/presentation/admin_dashboard_screen.dart';
import '../features/content_detail/presentation/content_detail_screen.dart';
import '../features/reader/presentation/pdf_reader_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  routes: [
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        return MainShell(child: child);
      },
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/search',
          builder: (context, state) {
            final cat = state.uri.queryParameters['category'];
            return SearchScreen(initialCategory: cat);
          },
        ),
        GoRoute(
          path: '/bookshelf',
          builder: (context, state) => const BookshelfScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/content/:id',
      builder: (context, state) {
        final id = state.pathParameters['id'] ?? '';
        return ContentDetailScreen(contentId: id);
      },
    ),
    GoRoute(
      path: '/reader/:id',
      builder: (context, state) {
        final id = state.pathParameters['id'] ?? '';
        final title = state.uri.queryParameters['title'] ?? 'Digital Book Reader';
        return PdfReaderScreen(contentId: id, bookTitle: title);
      },
    ),
  ],
);

class MainShell extends ConsumerWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/search')) return 1;
    if (location.startsWith('/bookshelf')) return 2;
    if (location.startsWith('/profile')) return 3;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/search');
        break;
      case 2:
        context.go('/bookshelf');
        break;
      case 3:
        context.go('/profile');
        break;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = _calculateSelectedIndex(context);
    final authState = ref.watch(authProvider);

    const armyGreen = Color(0xFF3B5836);
    const darkEmerald = Color(0xFF263A22);
    const sageWhite = Color(0xFFF7F9F7);

    // Determine status bar text based on Role
    String roleBannerText = 'Mode Terhubung • Hemat Kuota';
    Color bannerBg = const Color(0xFFE8F0E7);
    Color bannerTextColor = armyGreen;

    if (authState.role == UserRole.admin) {
      roleBannerText = '👑 Mode Admin • Pengelola Perpustakaan';
      bannerBg = const Color(0xFFFEF3C7);
      bannerTextColor = darkEmerald;
    } else if (authState.role == UserRole.member) {
      roleBannerText = '👤 Member Aktif • ${authState.user?.name ?? "Warga Desa"}';
      bannerBg = const Color(0xFFE8F0E7);
      bannerTextColor = armyGreen;
    } else {
      roleBannerText = '👁️ Mode Pengunjung (Guest)';
      bannerBg = const Color(0xFFF1F5F9);
      bannerTextColor = const Color(0xFF475569);
    }

    return Scaffold(
      backgroundColor: sageWhite,
      body: Stack(
        children: [
          // Main Route Content
          SafeArea(
            child: Column(
              children: [
                // Role & Connection Status Pill Banner
                Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                  child: Center(
                    child: GestureDetector(
                      onTap: () {
                        if (authState.role == UserRole.admin) {
                          context.go('/admin');
                        } else if (!authState.isAuthenticated) {
                          context.go('/login');
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: bannerBg,
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(color: bannerTextColor.withOpacity(0.2)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              authState.role == UserRole.admin
                                  ? Icons.admin_panel_settings_rounded
                                  : (authState.role == UserRole.member ? Icons.verified_user_rounded : Icons.visibility_rounded),
                              size: 14,
                              color: bannerTextColor,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              roleBannerText,
                              style: GoogleFonts.plusJakartaSans(
                                color: bannerTextColor,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: child,
                ),
              ],
            ),
          ),

          // Floating Glassmorphic Bottom Navigation Bar
          Positioned(
            left: 16,
            right: 16,
            bottom: 20,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                child: Container(
                  height: 66,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.85),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.6),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildNavItem(0, Icons.grid_view_rounded, 'Beranda', selectedIndex, context),
                      _buildNavItem(1, Icons.menu_book_rounded, 'Katalog', selectedIndex, context),
                      _buildNavItem(2, Icons.collections_bookmark_rounded, 'Rak Saya', selectedIndex, context),
                      _buildNavItem(3, Icons.person_rounded, 'Profil', selectedIndex, context),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, int selectedIndex, BuildContext context) {
    final isSelected = selectedIndex == index;
    const armyGreen = Color(0xFF3B5836);
    const oliveGray = Color(0xFF8E958D);

    return GestureDetector(
      onTap: () => _onItemTapped(index, context),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? armyGreen : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : oliveGray,
              size: 22,
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
