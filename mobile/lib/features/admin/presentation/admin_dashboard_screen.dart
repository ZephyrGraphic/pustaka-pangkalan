import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../auth/providers/auth_provider.dart';

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Add Book Form Controllers
  final _titleController = TextEditingController();
  final _authorController = TextEditingController();
  final _categoryController = TextEditingController(text: 'Pertanian & Peternakan');
  final _callNumberController = TextEditingController(text: '630.1 AHM p');

  bool _isSaving = false;
  bool _isSyncing = false;

  // Local Admin Catalog Items list for interactive demo
  final List<Map<String, String>> _adminCatalogList = [
    {
      'id': 'SLIMS-001',
      'title': 'Belajar Bertani Organik Lengkap',
      'author': 'Ir. Budi Santoso, M.Si.',
      'category': 'Pertanian & Peternakan',
      'callNo': '630.1 BUD b',
      'status': 'PUBLISHED',
    },
    {
      'id': 'SLIMS-002',
      'title': 'Panduan Manajemen & Pemasaran UMKM Desa',
      'author': 'Hj. Siti Rahmawati, S.E.',
      'category': 'Kewirausahaan & UMKM',
      'callNo': '658.8 SIT p',
      'status': 'PUBLISHED',
    },
    {
      'id': 'SLIMS-003',
      'title': 'Sejarah & Asal-Usul Desa Pangkalan',
      'author': 'Dr. H. Hartono',
      'category': 'Sejarah Desa',
      'callNo': '959.8 HAR s',
      'status': 'PUBLISHED',
    },
    {
      'id': 'SLIMS-004',
      'title': 'Dasar Literasi Digital & Keamanan Siber Warga',
      'author': 'Kominfo Desa Pangkalan',
      'category': 'Teknologi & Digital',
      'callNo': '004.6 KOM d',
      'status': 'PUBLISHED',
    },
    {
      'id': 'SLIMS-005',
      'title': 'Panduan Gizi Keluarga & Pencegahan Stunting',
      'author': 'dr. Anisa Permata',
      'category': 'Kesehatan & Gizi',
      'callNo': '613.2 ANI p',
      'status': 'PUBLISHED',
    },
  ];

  // Local Admin Members list
  final List<Map<String, dynamic>> _adminMemberList = [
    {
      'nik': '3202-2026-0042',
      'name': 'Pak Ahmad Subagyo',
      'phone': '085211223344',
      'rtRw': 'RT 02 / RW 04',
      'status': 'TERVERIFIKASI',
      'activeLoans': 2,
    },
    {
      'nik': '3202-2026-0108',
      'name': 'Ibu Nurhayati',
      'phone': '081399887766',
      'rtRw': 'RT 01 / RW 02',
      'status': 'TERVERIFIKASI',
      'activeLoans': 1,
    },
    {
      'nik': '3202-2026-0215',
      'name': 'Bambang Triyono',
      'phone': '087712345678',
      'rtRw': 'RT 04 / RW 05',
      'status': 'MENUNGGU VERIFIKASI',
      'activeLoans': 0,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _titleController.dispose();
    _authorController.dispose();
    _categoryController.dispose();
    _callNumberController.dispose();
    super.dispose();
  }

  void _handleAddBook() async {
    final title = _titleController.text.trim();
    final author = _authorController.text.trim();
    final category = _categoryController.text.trim();
    final callNo = _callNumberController.text.trim();

    if (title.isEmpty || author.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Judul dan Pengarang wajib diisi.')),
      );
      return;
    }

    setState(() => _isSaving = true);
    await Future.delayed(const Duration(milliseconds: 600));

    setState(() {
      _isSaving = false;
      _adminCatalogList.insert(0, {
        'id': 'SLIMS-00${_adminCatalogList.length + 1}',
        'title': title,
        'author': author,
        'category': category,
        'callNo': callNo,
        'status': 'PUBLISHED',
      });
    });

    _titleController.clear();
    _authorController.clear();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Buku "$title" berhasil ditambahkan ke Katalog SLiMS Desa!')),
      );
    }
  }

  void _handleSyncDatabase() async {
    setState(() => _isSyncing = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isSyncing = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sinkronisasi database SLiMS Senayan & Prisma SQLite Sukses! 🟢')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const armyGreen = Color(0xFF3B5836);
    const darkEmerald = Color(0xFF263A22);
    const sageWhite = Color(0xFFF6FBF2);
    const deepSlate = Color(0xFF181D18);
    const oliveGray = Color(0xFF596059);

    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: sageWhite,
      appBar: AppBar(
        backgroundColor: darkEmerald,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => context.go('/'),
        ),
        title: Text(
          'Panel Pengelola Perpustakaan',
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
            tooltip: 'Sinkronisasi SLiMS',
            onPressed: _isSyncing ? null : _handleSyncDatabase,
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.white),
            tooltip: 'Keluar Admin',
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
              if (mounted) context.go('/login');
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.amber,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          labelStyle: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(icon: Icon(Icons.library_books_rounded, size: 18), text: 'Katalog'),
            Tab(icon: Icon(Icons.people_alt_rounded, size: 18), text: 'Anggota'),
            Tab(icon: Icon(Icons.bar_chart_rounded, size: 18), text: 'Statistik'),
            Tab(icon: Icon(Icons.storage_rounded, size: 18), text: 'SLiMS Engine'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Admin Profile Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [darkEmerald, armyGreen],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: darkEmerald.withValues(alpha: 0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: Colors.white.withValues(alpha: 0.2),
                  child: const Icon(Icons.admin_panel_settings_rounded, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        authState.user?.name ?? 'Admin Kai (Kaydeen303)',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        'Pengelola Utama Perpustakaan Desa Pangkalan',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white70,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.amber,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'ADMIN',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: deepSlate,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tab Views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildKatalogTab(armyGreen, deepSlate, oliveGray),
                _buildAnggotaTab(armyGreen, deepSlate, oliveGray),
                _buildStatistikTab(armyGreen, deepSlate, oliveGray),
                _buildSlimsTab(armyGreen, deepSlate, oliveGray),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // TAB 1: Manajemen Katalog SLiMS
  Widget _buildKatalogTab(Color armyGreen, Color deepSlate, Color oliveGray) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Daftar Koleksi Digital (${_adminCatalogList.length})',
              style: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.bold, color: deepSlate),
            ),
            ElevatedButton.icon(
              onPressed: () => _showAddBookBottomSheet(armyGreen, deepSlate, oliveGray),
              icon: const Icon(Icons.add_rounded, size: 16),
              label: Text('Tambah Buku', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: armyGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        ..._adminCatalogList.map((item) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 1,
            shadowColor: Colors.black12,
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: armyGreen.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.book_rounded, color: armyGreen, size: 24),
              ),
              title: Text(
                item['title']!,
                style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13, color: deepSlate),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  '${item['author']} • ${item['category']}\nNo. Panggil: ${item['callNo']}',
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
                ),
              ),
              trailing: PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert_rounded, size: 20),
                onSelected: (val) {
                  if (val == 'delete') {
                    setState(() {
                      _adminCatalogList.removeWhere((x) => x['id'] == item['id']);
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Buku "${item['title']}" dihapus dari katalog.')),
                    );
                  }
                },
                itemBuilder: (ctx) => [
                  PopupMenuItem(
                    value: 'edit',
                    child: Text('Edit Metadata', style: GoogleFonts.plusJakartaSans(fontSize: 12)),
                  ),
                  PopupMenuItem(
                    value: 'delete',
                    child: Text('Hapus Koleksi', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.red)),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // TAB 2: Keanggotaan Warga
  Widget _buildAnggotaTab(Color armyGreen, Color deepSlate, Color oliveGray) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Daftar Anggota Warga (${_adminMemberList.length})',
              style: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.bold, color: deepSlate),
            ),
            OutlinedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Kamera Scanner Presensi QR Code Siap Digunakan.')),
                );
              },
              icon: const Icon(Icons.qr_code_scanner_rounded, size: 16, color: Color(0xFF3B5836)),
              label: Text('Scan Presensi', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF3B5836))),
              style: OutlinedButton.styleFrom(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        ..._adminMemberList.map((member) {
          final isVerified = member['status'] == 'TERVERIFIKASI';
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 1,
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: CircleAvatar(
                radius: 22,
                backgroundColor: isVerified ? armyGreen.withValues(alpha: 0.1) : Colors.amber.withValues(alpha: 0.2),
                child: Icon(
                  isVerified ? Icons.verified_user_rounded : Icons.pending_rounded,
                  color: isVerified ? armyGreen : Colors.amber[800],
                  size: 22,
                ),
              ),
              title: Text(
                member['name'],
                style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14, color: deepSlate),
              ),
              subtitle: Text(
                'NIK: ${member['nik']} • ${member['rtRw']}\nPinjaman Aktif: ${member['activeLoans']} Buku',
                style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
              ),
              trailing: isVerified
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                      child: Text('AKTIF', style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.green[800])),
                    )
                  : ElevatedButton(
                      onPressed: () {
                        setState(() {
                          member['status'] = 'TERVERIFIKASI';
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Anggota ${member['name']} berhasil diverifikasi!')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: armyGreen,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: Text('Verifikasi', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
            ),
          );
        }),
      ],
    );
  }

  // TAB 3: Laporan & Statistik Literasi
  Widget _buildStatistikTab(Color armyGreen, Color deepSlate, Color oliveGray) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(child: _buildStatMetricCard('142', 'Koleksi SLiMS', Icons.library_books_rounded, armyGreen, deepSlate, oliveGray)),
            const SizedBox(width: 10),
            Expanded(child: _buildStatMetricCard('85', 'Pinjaman Bulan Ini', Icons.auto_stories_rounded, armyGreen, deepSlate, oliveGray)),
            const SizedBox(width: 10),
            Expanded(child: _buildStatMetricCard('64', 'Anggota Warga', Icons.people_alt_rounded, armyGreen, deepSlate, oliveGray)),
          ],
        ),
        const SizedBox(height: 20),

        Text(
          'Kategori Paling Populer Dibaca',
          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold, color: deepSlate),
        ),
        const SizedBox(height: 12),

        _buildCategoryProgressRow('Pertanian & Peternakan', 0.85, '342 Dibaca', armyGreen, deepSlate),
        _buildCategoryProgressRow('Kewirausahaan & UMKM', 0.70, '280 Dibaca', armyGreen, deepSlate),
        _buildCategoryProgressRow('Sejarah Desa Pangkalan', 0.65, '240 Dibaca', armyGreen, deepSlate),
        _buildCategoryProgressRow('Teknologi & Literasi Digital', 0.50, '190 Dibaca', armyGreen, deepSlate),
        _buildCategoryProgressRow('Kesehatan & Gizi', 0.40, '150 Dibaca', armyGreen, deepSlate),
      ],
    );
  }

  // TAB 4: Engine SLiMS & Status Server
  Widget _buildSlimsTab(Color armyGreen, Color deepSlate, Color oliveGray) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: armyGreen.withValues(alpha: 0.2)),
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
              Row(
                children: [
                  Icon(Icons.storage_rounded, color: armyGreen, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Engine SLiMS Senayan Native & Prisma ORM',
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold, color: deepSlate),
                        ),
                        Text(
                          'Database SQLite Desa: file:///prisma/dev.db',
                          style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                    child: Text('ONLINE 🟢', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.green[800])),
                  ),
                ],
              ),
              const Divider(height: 24),
              _buildSlimsDetailRow('API Endpoint', 'http://localhost:3000/api/v1/contents'),
              _buildSlimsDetailRow('Sync Terakhir', '10 Agustus 2026, 16:40 WIB'),
              _buildSlimsDetailRow('Protokol Keamanan', 'JWT Bearer Authentication'),
              _buildSlimsDetailRow('Total Dokumen Indexed', '${_adminCatalogList.length} Judul Katalog'),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isSyncing ? null : _handleSyncDatabase,
                  icon: _isSyncing
                      ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.sync_rounded, size: 18),
                  label: Text(
                    _isSyncing ? 'Menghubungkan SLiMS Engine...' : 'Jalankan Sync Ulang SLiMS',
                    style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: armyGreen,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showAddBookBottomSheet(Color armyGreen, Color deepSlate, Color oliveGray) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Tambah Buku Katalog SLiMS Baru',
                    style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: deepSlate),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  labelText: 'Judul Modul / Buku',
                  prefixIcon: Icon(Icons.book_rounded, color: armyGreen),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _authorController,
                decoration: InputDecoration(
                  labelText: 'Nama Pengarang / Penulis',
                  prefixIcon: Icon(Icons.person_rounded, color: armyGreen),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _categoryController,
                      decoration: InputDecoration(
                        labelText: 'Kategori',
                        prefixIcon: Icon(Icons.category_rounded, color: armyGreen),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _callNumberController,
                      decoration: InputDecoration(
                        labelText: 'No. Panggil SLiMS',
                        prefixIcon: Icon(Icons.confirmation_number_rounded, color: armyGreen),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _handleAddBook();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: armyGreen,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text('Simpan ke Katalog SLiMS', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatMetricCard(String value, String label, IconData icon, Color armyGreen, Color deepSlate, Color oliveGray) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: armyGreen, size: 22),
          const SizedBox(height: 6),
          Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: deepSlate)),
          Text(label, textAlign: TextAlign.center, style: GoogleFonts.plusJakartaSans(fontSize: 9, color: oliveGray)),
        ],
      ),
    );
  }

  Widget _buildCategoryProgressRow(String category, double progress, String countText, Color armyGreen, Color deepSlate) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(category, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: deepSlate)),
              Text(countText, style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: armyGreen)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: armyGreen.withValues(alpha: 0.1),
              color: armyGreen,
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSlimsDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey[700])),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFF181D18)),
            ),
          ),
        ],
      ),
    );
  }
}
