import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../catalog/providers/catalog_provider.dart';
import '../../auth/providers/auth_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const armyGreen = Color(0xFF3B5836);
    const sageWhite = Color(0xFFF7F9F7);
    const softGreen = Color(0xFFE8F0E7);
    const deepSlate = Color(0xFF1F241F);
    const oliveGray = Color(0xFF8E958D);

    final categoriesAsync = ref.watch(categoriesProvider);
    final booksAsync = ref.watch(booksProvider(null));
    final authState = ref.watch(authProvider);

    String greetingTitle = 'Warga Desa 👋';
    String greetingSubtitle = 'Wilujeng Sumping,';
    if (authState.role == UserRole.admin) {
      greetingTitle = '${authState.user?.name ?? "Admin"} 👑';
      greetingSubtitle = 'Pengelola Utama,';
    } else if (authState.role == UserRole.member) {
      greetingTitle = '${authState.user?.name ?? "Warga Desa"} 👋';
      greetingSubtitle = 'Wilujeng Sumping,';
    } else {
      greetingTitle = 'Pengunjung Tamu 👁️';
      greetingSubtitle = 'Selamat Datang,';
    }

    return Scaffold(
      backgroundColor: sageWhite,
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(categoriesProvider);
          ref.invalidate(booksProvider(null));
        },
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 100),
          children: [
            // 1. Header Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      greetingSubtitle,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        color: oliveGray,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      greetingTitle,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: deepSlate,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: armyGreen.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.location_on, size: 12, color: armyGreen),
                          const SizedBox(width: 4),
                          Text(
                            'Desa Pangkalan',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: armyGreen,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => context.go('/profile'),
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: armyGreen.withValues(alpha: 0.15),
                        child: Icon(
                          authState.role == UserRole.admin
                              ? Icons.admin_panel_settings_rounded
                              : (authState.role == UserRole.member ? Icons.person_rounded : Icons.visibility_rounded),
                          color: armyGreen,
                        ),
                      ),
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          height: 10,
                          width: 10,
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Admin Banner Quick Link (If Admin Role)
            if (authState.role == UserRole.admin) ...[
              GestureDetector(
                onTap: () => context.go('/admin'),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.amber.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.admin_panel_settings_rounded, color: Color(0xFF92400E), size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Buka Panel Pengelola Perpustakaan',
                              style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF92400E)),
                            ),
                            Text(
                              'Tambah katalog SLiMS & pantau statistik desa',
                              style: GoogleFonts.plusJakartaSans(fontSize: 10, color: const Color(0xFFB45309)),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Color(0xFF92400E)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Guest Banner Link (If Guest Role)
            if (authState.role == UserRole.guest) ...[
              GestureDetector(
                onTap: () => context.go('/login'),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: armyGreen.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: armyGreen.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, color: armyGreen, size: 24),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Anda masuk sebagai Pengunjung Tamu. Klik di sini untuk Masuk Member & Akses Lengkap.',
                          style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: armyGreen),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () => context.go('/login'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: armyGreen,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          elevation: 0,
                        ),
                        child: Text('Masuk', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // 2. Reading Streak Card
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: softGreen,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: armyGreen.withValues(alpha: 0.15)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: armyGreen,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Text('🔥', style: TextStyle(fontSize: 22)),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '5 Hari Beruntun!',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: armyGreen,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Target hari ini: 15 menit membaca modul desa',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                color: armyGreen.withValues(alpha: 0.8),
                              ),
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: LinearProgressIndicator(
                                value: 0.65,
                                backgroundColor: armyGreen.withValues(alpha: 0.2),
                                valueColor: const AlwaysStoppedAnimation<Color>(armyGreen),
                                minHeight: 6,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 3. Search Action Bar
            GestureDetector(
              onTap: () => context.go('/search'),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 15,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search_rounded, color: armyGreen, size: 22),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Cari modul pertanian, e-book, atau dongeng...',
                        style: GoogleFonts.plusJakartaSans(
                          color: oliveGray,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: sageWhite,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.tune_rounded, color: armyGreen, size: 18),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 4. Categories Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Kategori Pengetahuan Desa',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: deepSlate,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/search'),
                  child: Text(
                    'Lihat Semua',
                    style: GoogleFonts.plusJakartaSans(
                      color: armyGreen,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            categoriesAsync.when(
              loading: () => const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator())),
              error: (err, stack) => _buildFallbackCategoryList(context, brandColor: armyGreen),
              data: (categories) {
                if (categories.isEmpty) return _buildFallbackCategoryList(context, brandColor: armyGreen);
                return SizedBox(
                  height: 42,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: categories.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final cat = categories[index];
                      return ActionChip(
                        avatar: Text(cat.icon ?? '📚', style: const TextStyle(fontSize: 13)),
                        label: Text(
                          cat.name,
                          style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: deepSlate),
                        ),
                        backgroundColor: Colors.white,
                        side: BorderSide(color: armyGreen.withValues(alpha: 0.15)),
                        elevation: 1,
                        shadowColor: Colors.black.withValues(alpha: 0.04),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        onPressed: () => context.go('/search?category=${cat.slug}'),
                      );
                    },
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // 5. Section "Sedang Dibaca" (Continue Reading)
            Text(
              'Lanjutkan Membaca',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: deepSlate,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 15,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: 56,
                      height: 76,
                      color: armyGreen.withValues(alpha: 0.1),
                      child: Image.network(
                        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(Icons.book, color: armyGreen),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: softGreen,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Pertanian',
                            style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: armyGreen),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Panduan Budidaya Padi Organik',
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold, color: deepSlate),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'Halaman 42 dari 120 (35%)',
                          style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: 0.35,
                            backgroundColor: sageWhite,
                            valueColor: const AlwaysStoppedAnimation<Color>(armyGreen),
                            minHeight: 5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () => context.push('/reader/demo-1?title=Panduan%20Budidaya%20Padi%20Organik'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: armyGreen,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: Text('Lanjut', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 6. Carousel "Unggulan Minggu Ini" (Featured E-Books)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Koleksi Unggulan Desa',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: deepSlate,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/search'),
                  child: Text(
                    'Lihat Semua',
                    style: GoogleFonts.plusJakartaSans(color: armyGreen, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            booksAsync.when(
              loading: () => const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator())),
              error: (err, stack) => const Text('Gagal memuat katalog'),
              data: (books) {
                final displayBooks = books.isNotEmpty ? books : sampleBooksDataset;
                return SizedBox(
                  height: 220,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    itemCount: displayBooks.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 14),
                    itemBuilder: (context, index) {
                      final book = displayBooks[index];
                      return GestureDetector(
                        onTap: () => context.push('/content/${book.id}'),
                        child: Container(
                          width: 140,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ClipRRect(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                                child: AspectRatio(
                                  aspectRatio: 1.1,
                                  child: Image.network(
                                    book.coverUrl ?? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop',
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) => Container(
                                      color: armyGreen.withValues(alpha: 0.1),
                                      child: const Icon(Icons.book, color: armyGreen, size: 40),
                                    ),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(10.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      book.title,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: deepSlate,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      book.authorName ?? 'Penulis Desa',
                                      style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                                        const SizedBox(width: 3),
                                        Text(
                                          '4.9',
                                          style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: deepSlate),
                                        ),
                                        const Spacer(),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                          decoration: BoxDecoration(
                                            color: softGreen,
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            'PDF',
                                            style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.bold, color: armyGreen),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // 7. Seksi "Khasanah Lokal Desa" Banner Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [armyGreen, Color(0xFF263A22)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: armyGreen.withValues(alpha: 0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Khasanah Lokal Desa',
                            style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Arsip Sejarah & Cerita Rakyat Desa Pangkalan',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Jelajahi rekam jejak kearifan lokal Sunda dan dokumen arsip resmi desa.',
                          style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white70),
                        ),
                        const SizedBox(height: 14),
                        ElevatedButton(
                          onPressed: () => context.go('/search?category=sastra-budaya'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: armyGreen,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                          child: Text('Buka Arsip Desa', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Icon(Icons.museum_rounded, color: Colors.white70, size: 70),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallbackCategoryList(BuildContext context, {required Color brandColor}) {
    final fallbacks = [
      {'name': 'Pertanian & Peternakan', 'icon': '🌾', 'slug': 'pertanian'},
      {'name': 'Sastra & Budaya Sunda', 'icon': '📚', 'slug': 'sastra-budaya'},
      {'name': 'Wirausaha UMKM', 'icon': '💼', 'slug': 'wirausaha'},
      {'name': 'Kesehatan Desa', 'icon': '🩺', 'slug': 'kesehatan'},
      {'name': 'Teknologi Tepat Guna', 'icon': '⚡', 'slug': 'teknologi'},
    ];

    return SizedBox(
      height: 42,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: fallbacks.length,
        separatorBuilder: (context, index) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = fallbacks[index];
          return ActionChip(
            avatar: Text(cat['icon']!, style: const TextStyle(fontSize: 13)),
            label: Text(
              cat['name']!,
              style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF1F241F)),
            ),
            backgroundColor: Colors.white,
            side: BorderSide(color: brandColor.withValues(alpha: 0.15)),
            elevation: 1,
            shadowColor: Colors.black.withValues(alpha: 0.04),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onPressed: () => context.go('/search?category=${cat['slug']}'),
          );
        },
      ),
    );
  }
}
