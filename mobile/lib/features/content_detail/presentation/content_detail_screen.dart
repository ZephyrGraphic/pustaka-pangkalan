import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../shared/models/book.dart';
import '../../catalog/providers/catalog_provider.dart';

class ContentDetailScreen extends ConsumerStatefulWidget {
  final String contentId;

  const ContentDetailScreen({super.key, required this.contentId});

  @override
  ConsumerState<ContentDetailScreen> createState() => _ContentDetailScreenState();
}

class _ContentDetailScreenState extends ConsumerState<ContentDetailScreen> {
  bool _isExpanded = false;
  bool _isBookmarked = false;
  bool _isDownloading = false;

  @override
  Widget build(BuildContext context) {
    const armyGreen = Color(0xFF3B5836);
    const sageWhite = Color(0xFFF7F9F7);
    const oliveGray = Color(0xFF8E958D);
    const deepSlate = Color(0xFF1F241F);

    final bookAsync = ref.watch(bookDetailProvider(widget.contentId));

    return Scaffold(
      backgroundColor: sageWhite,
      body: bookAsync.when(
        loading: () {
          final fallbackBook = sampleBooksDataset.firstWhere(
            (b) => b.id == widget.contentId,
            orElse: () => sampleBooksDataset.first,
          );
          return _buildDetailView(context, fallbackBook, armyGreen, sageWhite, oliveGray, deepSlate);
        },
        error: (err, stack) {
          final fallbackBook = sampleBooksDataset.firstWhere(
            (b) => b.id == widget.contentId,
            orElse: () => sampleBooksDataset.first,
          );
          return _buildDetailView(context, fallbackBook, armyGreen, sageWhite, oliveGray, deepSlate);
        },
        data: (book) => _buildDetailView(context, book ?? sampleBooksDataset.first, armyGreen, sageWhite, oliveGray, deepSlate),
      ),
    );
  }

  Widget _buildDetailView(
    BuildContext context,
    Book? book,
    Color armyGreen,
    Color sageWhite,
    Color oliveGray,
    Color deepSlate,
  ) {
    final title = book?.title ?? 'Panduan Budidaya Padi Organik & Lahan Desa';
    final author = book?.authorName ?? 'Ir. Ahmad Subagyo, M.P.';
    String publisher = 'SLiMS Perpustakaan Desa Pangkalan';
    try {
      publisher = book?.publisherName ?? 'SLiMS Perpustakaan Desa Pangkalan';
    } catch (_) {}
    final coverUrl = book?.coverUrl ?? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2068&auto=format&fit=crop';
    final category = book?.categoryName ?? 'Pertanian';
    final synopsis = book?.description ??
        'Panduan komprehensif budidaya padi organik, pembuatan pupuk kompos cair hayati, pemanfaatan agens hayati pencegah hama, serta pengolahan tanah ramah lingkungan untuk meningkatkan produktivitas hasil panen warga desa secara mandiri dan berkelanjutan.';

    return Stack(
      children: [
        CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // 1. Hero Header Background
            SliverAppBar(
              expandedHeight: 320,
              backgroundColor: sageWhite,
              elevation: 0,
              pinned: true,
              leading: Padding(
                padding: const EdgeInsets.all(8.0),
                child: CircleAvatar(
                  backgroundColor: Colors.white.withOpacity(0.85),
                  child: IconButton(
                    icon: Icon(Icons.arrow_back_rounded, color: deepSlate),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
              ),
              actions: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.85),
                    child: IconButton(
                      icon: Icon(Icons.share_outlined, color: deepSlate),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Tautan buku berhasil disalin!')),
                        );
                      },
                    ),
                  ),
                ),
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      coverUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(color: armyGreen.withOpacity(0.2)),
                    ),
                    BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                      child: Container(
                        color: sageWhite.withOpacity(0.45),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            sageWhite.withOpacity(0.8),
                            sageWhite,
                          ],
                        ),
                      ),
                    ),
                    Center(
                      child: Container(
                        margin: const EdgeInsets.only(top: 50),
                        height: 220,
                        width: 150,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Image.network(
                            coverUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              color: armyGreen,
                              child: const Icon(Icons.book, color: Colors.white, size: 60),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 2. Details Content Body
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
                child: Column(
                  children: [
                    // Category Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: armyGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        category,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: armyGreen,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Title
                    Text(
                      title,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: deepSlate,
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Author & Publisher
                    Text(
                      'Oleh $author\n$publisher',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: oliveGray,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Key Metrics Cards
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMetricItem(Icons.menu_book_rounded, '120 Hlm', 'Halaman', armyGreen, deepSlate, oliveGray),
                          Container(height: 30, width: 1, color: Colors.black.withOpacity(0.08)),
                          _buildMetricItem(Icons.sd_card_outlined, '4.8 MB', 'PDF Offline', armyGreen, deepSlate, oliveGray),
                          Container(height: 30, width: 1, color: Colors.black.withOpacity(0.08)),
                          _buildMetricItem(Icons.star_rounded, '4.9 ⭐', '38 Ulasan', armyGreen, deepSlate, oliveGray),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Synopsis Section
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Ringkasan & Sinopsis',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: deepSlate,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      synopsis,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        color: deepSlate.withOpacity(0.8),
                        height: 1.6,
                      ),
                      maxLines: _isExpanded ? 100 : 4,
                      overflow: TextOverflow.ellipsis,
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _isExpanded = !_isExpanded;
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Text(
                          _isExpanded ? 'Sembunyikan' : 'Baca Selengkapnya...',
                          style: GoogleFonts.plusJakartaSans(
                            color: armyGreen,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Catalog Info Table
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.black.withOpacity(0.05)),
                      ),
                      child: Column(
                        children: [
                          _buildInfoRow('Nomor Panggil SLiMS', '630.1 AHM p', deepSlate, oliveGray),
                          const Divider(height: 16),
                          _buildInfoRow('Klasifikasi DDC', '630 - Pertanian', deepSlate, oliveGray),
                          const Divider(height: 16),
                          _buildInfoRow('Nomor ISBN', '978-602-8819-01-2', deepSlate, oliveGray),
                          const Divider(height: 16),
                          _buildInfoRow('Status Akses', 'Tersedia Lengkap (Digital)', deepSlate, oliveGray),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        // Fixed Bottom Action Bar
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 20,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: Row(
              children: [
                // Bookmark Icon Button
                Container(
                  decoration: BoxDecoration(
                    color: sageWhite,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: IconButton(
                    icon: Icon(
                      _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                      color: armyGreen,
                    ),
                    onPressed: () {
                      setState(() {
                        _isBookmarked = !_isBookmarked;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_isBookmarked ? 'Buku disimpan ke Rak Saya!' : 'Buku dihapus dari Bookmark.'),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),

                // Primary Read Now Button
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      context.push('/reader/${widget.contentId}?title=${Uri.encodeComponent(title)}');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: armyGreen,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 2,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.auto_stories_rounded, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'BACA SEKARANG 📖',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMetricItem(IconData icon, String value, String label, Color armyGreen, Color deepSlate, Color oliveGray) {
    return Column(
      children: [
        Icon(icon, color: armyGreen, size: 22),
        const SizedBox(height: 4),
        Text(value, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13, color: deepSlate)),
        Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray)),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, Color deepSlate, Color oliveGray) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: oliveGray)),
        Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold, color: deepSlate)),
      ],
    );
  }
}
