import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _isDarkMode = false;
  bool _isDataSaver = true;
  bool _isNotificationsEnabled = true;

  // Local Offline PDF Cache list
  final List<Map<String, String>> _offlineDownloads = [
    {
      'title': 'Belajar Bertani Organik Lengkap.pdf',
      'size': '4.2 MB',
      'date': '08 Ags 2026',
    },
    {
      'title': 'Sejarah & Asal-Usul Desa Pangkalan.pdf',
      'size': '8.2 MB',
      'date': '10 Ags 2026',
    },
  ];

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
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        title: Text(
          'Profil & Pengaturan Warga',
          style: GoogleFonts.plusJakartaSans(
            color: deepSlate,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 100),
        child: Column(
          children: [
            // 1. Dynamic Card based on Role
            if (authState.role == UserRole.guest)
              _buildGuestCard(context, armyGreen, deepSlate, oliveGray)
            else if (authState.role == UserRole.admin)
              _buildAdminProfileCard(context, authState, armyGreen, darkEmerald)
            else
              _buildMembershipCard(context, authState, armyGreen, darkEmerald),

            const SizedBox(height: 24),

            // 2. Main Settings Section
            _buildSettingsGroup([
              if (authState.role == UserRole.admin)
                _buildNavigationTile(
                  icon: Icons.admin_panel_settings_rounded,
                  title: 'Buka Panel Admin & SLiMS',
                  subtitle: 'Manajemen Koleksi, Anggota & Sync Engine',
                  onTap: () => context.go('/admin'),
                ),

              if (authState.isAuthenticated)
                _buildNavigationTile(
                  icon: Icons.edit_note_rounded,
                  title: 'Edit Data Profil Warga',
                  subtitle: 'Nama, Telepon, RT/RW Desa',
                  onTap: () => _showEditProfileDialog(authState, armyGreen, deepSlate),
                ),

              if (authState.isAuthenticated)
                _buildNavigationTile(
                  icon: Icons.lock_outline_rounded,
                  title: 'Keamanan & Ubah PIN',
                  subtitle: 'Perbarui kata sandi atau PIN masuk',
                  onTap: () => _showChangePasswordDialog(armyGreen, deepSlate),
                ),

              _buildToggleTile(
                icon: Icons.dark_mode_outlined,
                title: 'Mode Malam',
                subtitle: 'Tampilan nyaman di kegelapan',
                value: _isDarkMode,
                onChanged: (val) {
                  setState(() => _isDarkMode = val);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(val ? 'Mode Malam Diaktifkan' : 'Mode Terang Diaktifkan')),
                  );
                },
              ),

              _buildToggleTile(
                icon: Icons.bolt_outlined,
                title: 'Mode Hemat Kuota',
                subtitle: 'Prioritaskan bacaan dari penyimpanan lokal (Offline First)',
                value: _isDataSaver,
                onChanged: (val) => setState(() => _isDataSaver = val),
              ),

              _buildToggleTile(
                icon: Icons.notifications_none_rounded,
                title: 'Notifikasi & Warta Desa',
                subtitle: 'Koleksi baru & kegiatan literasi desa',
                value: _isNotificationsEnabled,
                onChanged: (val) => setState(() => _isNotificationsEnabled = val),
              ),

              _buildNavigationTile(
                icon: Icons.sd_storage_outlined,
                title: 'Kelola Penyimpanan Offline',
                subtitle: '${_offlineDownloads.length} Berkas PDF Terunduh',
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: armyGreen.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '12.4 MB',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: armyGreen,
                    ),
                  ),
                ),
                onTap: () => _showOfflineStorageBottomSheet(armyGreen, deepSlate, oliveGray),
              ),

              _buildNavigationTile(
                icon: Icons.help_outline_rounded,
                title: 'Bantuan & Layanan Balai Desa',
                subtitle: 'Hubungi pengelola perpustakaan di Balai Desa',
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Layanan Kontak Balai Desa Pangkalan: WhatsApp 0852-1122-3344')),
                  );
                },
              ),

              _buildNavigationTile(
                icon: Icons.info_outline_rounded,
                title: 'Tentang Aplikasi',
                subtitle: 'Versi 1.0.0 (SLiMS Engine Integrated)',
                onTap: () {
                  showAboutDialog(
                    context: context,
                    applicationName: 'Pustaka Pangkalan',
                    applicationVersion: 'v1.0.0 (Build 2026)',
                    applicationLegalese: 'Perpustakaan Digital Desa Pangkalan • Hak Cipta © 2026',
                  );
                },
              ),
            ]),

            const SizedBox(height: 24),

            // 3. Auth Logout / Login Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await ref.read(authProvider.notifier).logout();
                  if (mounted) context.go('/login');
                },
                icon: Icon(
                  authState.isAuthenticated ? Icons.logout_rounded : Icons.login_rounded,
                  color: authState.isAuthenticated ? Colors.redAccent : armyGreen,
                  size: 20,
                ),
                label: Text(
                  authState.isAuthenticated ? 'Keluar dari Akun' : 'Masuk / Ganti Akun',
                  style: GoogleFonts.plusJakartaSans(
                    color: authState.isAuthenticated ? Colors.redAccent : armyGreen,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(
                      color: (authState.isAuthenticated ? Colors.redAccent : armyGreen).withValues(alpha: 0.3),
                    ),
                  ),
                  elevation: 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGuestCard(BuildContext context, Color armyGreen, Color deepSlate, Color oliveGray) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
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
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: armyGreen.withValues(alpha: 0.1),
            child: Icon(Icons.person_outline_rounded, color: armyGreen, size: 32),
          ),
          const SizedBox(height: 12),
          Text(
            'Pengunjung Tamu (Guest Mode)',
            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16, color: deepSlate),
          ),
          const SizedBox(height: 4),
          Text(
            'Masuk sebagai member warga desa untuk mendapatkan Kartu Anggota Digital & akses offline penuh.',
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () => context.go('/login'),
            icon: const Icon(Icons.badge_rounded, size: 18),
            label: Text('Masuk / Daftar Member', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 12)),
            style: ElevatedButton.styleFrom(
              backgroundColor: armyGreen,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdminProfileCard(BuildContext context, AuthState authState, Color armyGreen, Color darkEmerald) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [darkEmerald, const Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: darkEmerald.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'PUSTAKA PANGKALAN',
                style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1.2),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(8)),
                child: Text('ADMIN PENGELOLA', style: GoogleFonts.plusJakartaSans(color: Colors.black, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: Colors.white.withValues(alpha: 0.2),
                child: const Icon(Icons.admin_panel_settings_rounded, color: Colors.white, size: 32),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      authState.user?.name ?? 'Admin Kai (Kaydeen303)',
                      style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 2),
                    Text('Akses Penuh SLiMS & Manajemen Katalog', style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 11)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMembershipCard(BuildContext context, AuthState authState, Color armyGreen, Color darkEmerald) {
    return GestureDetector(
      onTap: () => _showQRCodeModal(context, authState, armyGreen, darkEmerald),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [darkEmerald, armyGreen],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: darkEmerald.withValues(alpha: 0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.local_library_rounded, color: Colors.white, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'PUSTAKA PANGKALAN',
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'WARGA AKTIF',
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white.withValues(alpha: 0.2),
                  child: const Icon(Icons.person_rounded, color: Colors.white, size: 32),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        authState.user?.name ?? 'Pak Ahmad Subagyo',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'NIK: 3202-2026-0042',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white70,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                // QR Code Button
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.qr_code_2_rounded, color: Color(0xFF263A22), size: 36),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showQRCodeModal(BuildContext context, AuthState authState, Color armyGreen, Color darkEmerald) {
    showDialog(
      context: context,
      builder: (ctx) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'KARTU ANGGOTA DIGITAL',
                  style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold, color: darkEmerald, letterSpacing: 1),
                ),
                const SizedBox(height: 4),
                Text(
                  'Tunjukkan QR Code ini kepada pengelola di Balai Desa Pangkalan untuk presensi dan peminjaman fisik.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey[700]),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: armyGreen.withValues(alpha: 0.3), width: 2),
                    boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
                  ),
                  child: const Icon(Icons.qr_code_2_rounded, size: 160, color: Color(0xFF263A22)),
                ),
                const SizedBox(height: 16),
                Text(
                  authState.user?.name ?? 'Pak Ahmad Subagyo',
                  style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: const Color(0xFF181D18)),
                ),
                Text(
                  'NIK: 3202-2026-0042',
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: armyGreen,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text('Tutup', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showEditProfileDialog(AuthState authState, Color armyGreen, Color deepSlate) {
    final nameCtrl = TextEditingController(text: authState.user?.name ?? 'Pak Ahmad Subagyo');
    final phoneCtrl = TextEditingController(text: authState.user?.phone ?? '085211223344');

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text('Edit Profil Warga', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'Nama Lengkap'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                decoration: const InputDecoration(labelText: 'Nomor Telepon / WhatsApp'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Batal'),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.pop(ctx);
                await ref.read(authProvider.notifier).loginAsMember(
                  name: nameCtrl.text.trim(),
                  phone: phoneCtrl.text.trim(),
                );
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Profil berhasil diperbarui!')),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: armyGreen, foregroundColor: Colors.white),
              child: const Text('Simpan'),
            ),
          ],
        );
      },
    );
  }

  void _showChangePasswordDialog(Color armyGreen, Color deepSlate) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text('Ubah PIN / Password', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16)),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(obscureText: true, decoration: InputDecoration(labelText: 'PIN / Password Lama')),
              SizedBox(height: 12),
              TextField(obscureText: true, decoration: InputDecoration(labelText: 'PIN / Password Baru')),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('PIN/Password Anda berhasil diperbarui!')),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: armyGreen, foregroundColor: Colors.white),
              child: const Text('Perbarui PIN'),
            ),
          ],
        );
      },
    );
  }

  void _showOfflineStorageBottomSheet(Color armyGreen, Color deepSlate, Color oliveGray) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Penyimpanan Offline (${_offlineDownloads.length} Berkas)',
                    style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: deepSlate),
                  ),
                  TextButton(
                    onPressed: () {
                      setState(() => _offlineDownloads.clear());
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Semua cache PDF offline berhasil dibersihkan!')),
                      );
                    },
                    child: Text('Bersihkan All', style: GoogleFonts.plusJakartaSans(color: Colors.red, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (_offlineDownloads.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Center(
                    child: Text('Tidak ada berkas PDF offline.', style: GoogleFonts.plusJakartaSans(color: oliveGray)),
                  ),
                )
              else
                ..._offlineDownloads.map((file) {
                  return ListTile(
                    leading: Icon(Icons.picture_as_pdf_rounded, color: armyGreen),
                    title: Text(file['title']!, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: Text('${file['size']} • Unduh ${file['date']}', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: oliveGray)),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline_rounded, color: Colors.red, size: 18),
                      onPressed: () {
                        setState(() {
                          _offlineDownloads.remove(file);
                        });
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Berkas "${file['title']}" dihapus.')),
                        );
                      },
                    ),
                  );
                }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSettingsGroup(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }

  Widget _buildToggleTile({
    required IconData icon,
    required String title,
    String? subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    const armyGreen = Color(0xFF3B5836);
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: armyGreen.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: armyGreen, size: 20),
      ),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold)),
      subtitle: subtitle != null ? Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.grey)) : null,
      trailing: Switch(
        value: value,
        activeTrackColor: armyGreen,
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildNavigationTile({
    required IconData icon,
    required String title,
    String? subtitle,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    const armyGreen = Color(0xFF3B5836);
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: armyGreen.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: armyGreen, size: 20),
      ),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.bold)),
      subtitle: subtitle != null ? Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.grey)) : null,
      trailing: trailing ?? const Icon(Icons.chevron_right_rounded, size: 20),
    );
  }
}
