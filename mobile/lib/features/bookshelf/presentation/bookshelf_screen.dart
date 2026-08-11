import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/bookshelf_provider.dart';
import '../../../shared/models/book.dart';
import '../../../shared/models/reading_progress.dart';

class BookshelfScreen extends ConsumerStatefulWidget {
  const BookshelfScreen({super.key});

  @override
  ConsumerState<BookshelfScreen> createState() => _BookshelfScreenState();
}

class _BookshelfScreenState extends ConsumerState<BookshelfScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const armyGreen = Color(0xFF3B5836);
    const sageWhite = Color(0xFFF7F9F7);
    const deepSlate = Color(0xFF1F241F);
    const oliveGray = Color(0xFF8E958D);

    final bookshelfState = ref.watch(bookshelfProvider);

    return Scaffold(
      backgroundColor: sageWhite,
      appBar: AppBar(
        backgroundColor: sageWhite,
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Rak Buku Saya',
          style: GoogleFonts.plusJakartaSans(
            color: deepSlate,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: deepSlate),
            onPressed: () => context.go('/profile'),
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Reading Stats Card
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: armyGreen,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: armyGreen.withValues(alpha: 0.3),
                    blurRadius: 20,
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
                        _buildStatRow(Icons.auto_stories_rounded, bookshelfState.activeReading.length.toString(), 'Buku Dibaca'),
                        const SizedBox(height: 12),
                        _buildStatRow(Icons.bookmark_border_rounded, bookshelfState.bookmarks.length.toString(), 'Bookmark'),
                        const SizedBox(height: 12),
                        _buildStatRow(Icons.cloud_done_outlined, '6', 'Buku Offline'),
                      ],
                    ),
                  ),
                  const SizedBox(width: 20),
                  // Progress Ring
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        height: 76,
                        width: 76,
                        child: CircularProgressIndicator(
                          value: 0.75,
                          strokeWidth: 7,
                          backgroundColor: Colors.white.withValues(alpha: 0.2),
                          valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      ),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '75%',
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            'Target',
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white70,
                              fontSize: 9,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),

          // 2. Segmented Custom Tab Bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
            ),
            child: TabBar(
              controller: _tabController,
              indicator: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: armyGreen,
              ),
              labelColor: Colors.white,
              unselectedLabelColor: oliveGray,
              labelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 12),
              unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 12),
              padding: const EdgeInsets.all(4),
              tabs: const [
                Tab(text: 'Sedang Dibaca'),
                Tab(text: 'Offline (6)'),
                Tab(text: 'Bookmark'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Tab Views Content
          Expanded(
            child: bookshelfState.isLoading 
              ? const Center(child: CircularProgressIndicator(color: armyGreen))
              : TabBarView(
                  controller: _tabController,
                  children: [
                    // Tab 1: Sedang Dibaca
                    _buildActiveReadingList(context, armyGreen, deepSlate, oliveGray, bookshelfState.activeReading),
                    // Tab 2: Tersimpan Offline
                    _buildOfflineSavedList(context, armyGreen, deepSlate, oliveGray),
                    // Tab 3: Bookmark & Favorit
                    _buildBookmarksList(context, armyGreen, deepSlate, oliveGray, bookshelfState.bookmarks),
                  ],
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow(IconData icon, String value, String label) {
    return Row(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(width: 10),
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white70,
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _buildActiveReadingList(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray, List<ReadingProgressModel> items) {
    if (items.isEmpty) {
      return Center(
        child: Text(
          'Belum ada buku yang sedang dibaca.',
          style: GoogleFonts.plusJakartaSans(color: oliveGray, fontSize: 13),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      itemCount: items.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return Container(
          padding: const EdgeInsets.all(14),
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
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: SizedBox(
                  width: 54,
                  height: 74,
                  child: item.coverUrl != null
                      ? Image.network(
                          item.coverUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(color: armyGreen.withValues(alpha: 0.1)),
                        )
                      : Container(color: armyGreen.withValues(alpha: 0.1)),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold, color: deepSlate),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Hlm ${item.currentPage} / ${item.totalPages} • Terakhir dibaca ${item.lastReadAt != null ? item.lastReadAt!.day.toString() + "/" + item.lastReadAt!.month.toString() : "-"}',
                      style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray),
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: item.progressPercent / 100,
                        backgroundColor: const Color(0xFFF7F9F7),
                        valueColor: AlwaysStoppedAnimation<Color>(armyGreen),
                        minHeight: 5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              IconButton(
                icon: Icon(Icons.play_circle_fill_rounded, color: armyGreen, size: 36),
                onPressed: () => context.push('/reader/${item.contentId}?title=${Uri.encodeComponent(item.title)}'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOfflineSavedList(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: armyGreen.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(Icons.sd_card_outlined, color: armyGreen, size: 20),
              const SizedBox(width: 10),
              Text(
                '6 Berkas PDF Tersimpan Offline (12.4 MB)',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold, color: armyGreen),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ListTile(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          tileColor: Colors.white,
          leading: const Icon(Icons.picture_as_pdf_rounded, color: Colors.redAccent),
          title: Text('Modul Pupuk Organik Cair.pdf', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13)),
          subtitle: Text('3.2 MB • Siap dibaca tanpa internet', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray)),
          trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
          onTap: () => context.push('/reader/demo-1?title=Modul%20Pupuk%20Organik'),
        ),
      ],
    );
  }

  Widget _buildBookmarksList(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray, List<Book> items) {
    if (items.isEmpty) {
      return Center(
        child: Text(
          'Belum ada bookmark favorit.',
          style: GoogleFonts.plusJakartaSans(color: oliveGray, fontSize: 13),
        ),
      );
    }
    
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      itemCount: items.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        return ListTile(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          tileColor: Colors.white,
          leading: Icon(Icons.bookmark, color: armyGreen),
          title: Text(item.title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1, overflow: TextOverflow.ellipsis),
          subtitle: Text(item.categoryName ?? 'Buku', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray)),
          trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
          onTap: () => context.push('/content/${item.id}'),
        );
      },
    );
  }
}
