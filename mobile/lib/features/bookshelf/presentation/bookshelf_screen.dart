import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

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
                    color: armyGreen.withOpacity(0.3),
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
                        _buildStatRow(Icons.auto_stories_rounded, '14', 'Buku Dibaca'),
                        const SizedBox(height: 12),
                        _buildStatRow(Icons.timer_outlined, '28', 'Jam Membaca'),
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
                          backgroundColor: Colors.white.withOpacity(0.2),
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
              border: Border.all(color: Colors.black.withOpacity(0.05)),
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
            child: TabBarView(
              controller: _tabController,
              children: [
                // Tab 1: Sedang Dibaca
                _buildActiveReadingList(context, armyGreen, deepSlate, oliveGray),
                // Tab 2: Tersimpan Offline
                _buildOfflineSavedList(context, armyGreen, deepSlate, oliveGray),
                // Tab 3: Bookmark & Favorit
                _buildBookmarksList(context, armyGreen, deepSlate, oliveGray),
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

  Widget _buildActiveReadingList(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray) {
    final activeItems = [
      {
        'id': 'demo-1',
        'title': 'Panduan Budidaya Padi Organik',
        'category': 'Pertanian',
        'progress': 0.35,
        'page': 'Hlm 42 / 120',
        'lastRead': 'Kemarin, 19:30',
        'cover': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop',
      },
      {
        'id': 'demo-2',
        'title': 'Kumpulan Dongeng & Sasakala Tatar Sunda',
        'category': 'Sastra Sunda',
        'progress': 0.70,
        'page': 'Hlm 64 / 90',
        'lastRead': 'Hari ini, 08:15',
        'cover': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop',
      },
    ];

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      itemCount: activeItems.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = activeItems[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
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
                  child: Image.network(
                    item['cover'] as String,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: armyGreen.withOpacity(0.1)),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['title'] as String,
                      style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold, color: deepSlate),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${item['page']} • ${item['lastRead']}',
                      style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray),
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: item['progress'] as double,
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
                onPressed: () => context.push('/reader/${item['id']}?title=${Uri.encodeComponent(item['title'] as String)}'),
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
            color: armyGreen.withOpacity(0.08),
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

  Widget _buildBookmarksList(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray) {
    return Center(
      child: Text(
        'Belum ada bookmark favorit.',
        style: GoogleFonts.plusJakartaSans(color: oliveGray, fontSize: 13),
      ),
    );
  }
}
