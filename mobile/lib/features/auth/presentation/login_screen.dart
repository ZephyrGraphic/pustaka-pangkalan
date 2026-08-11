import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool _isLogin = true;
  bool _isPasswordVisible = false;

  // Controllers
  final _phoneController = TextEditingController(text: '081574627052');
  final _passwordController = TextEditingController(text: 'Kaydeen303');

  // Register Controllers
  final _regNameController = TextEditingController();
  final _regNikController = TextEditingController();
  final _regPhoneController = TextEditingController();
  final _regPasswordController = TextEditingController();

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    _regNameController.dispose();
    _regNikController.dispose();
    _regPhoneController.dispose();
    _regPasswordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();

    if (phone.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Silakan masukkan NIK/Nomor HP dan Kata Sandi.')),
      );
      return;
    }

    try {
      final success = await ref.read(authProvider.notifier).login(phone, password);
      if (success && mounted) {
        final role = ref.read(authProvider).role;
        if (role == UserRole.admin) {
          context.go('/admin');
        } else {
          context.go('/');
        }
      } else if (mounted) {
        final error = ref.read(authProvider).errorMessage;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error ?? 'Login gagal')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Terjadi kesalahan: $e')),
        );
      }
    }
  }

  void _handleRegister() async {
    final name = _regNameController.text.trim();
    final nik = _regNikController.text.trim();
    final phone = _regPhoneController.text.trim();
    final password = _regPasswordController.text.trim();

    if (name.isEmpty || (nik.isEmpty && phone.isEmpty) || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Silakan lengkapi formulir pendaftaran anggota.')),
      );
      return;
    }

    final identifier = nik.isNotEmpty ? nik : phone;
    final success = await ref.read(authProvider.notifier).registerMember(
      name: name,
      nikOrPhone: identifier,
      password: password,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selamat bergabung di Pustaka Pangkalan, $name! 🎉')),
      );
      context.go('/');
    } else if (mounted) {
      final error = ref.read(authProvider).errorMessage;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error ?? 'Pendaftaran gagal')),
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
      body: Stack(
        children: [
          // 1. Background Hero Header with Gradient
          Container(
            height: MediaQuery.of(context).size.height * 0.35,
            width: double.infinity,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop'),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.3),
                    sageWhite.withValues(alpha: 0.85),
                    sageWhite,
                  ],
                ),
              ),
            ),
          ),

          // 2. Scrollable Body
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 440),
                  child: Column(
                    children: [
                      const SizedBox(height: 12),
                      // Logo Badge
                      Container(
                        height: 72,
                        width: 72,
                        decoration: BoxDecoration(
                          color: armyGreen,
                          borderRadius: BorderRadius.circular(22),
                          boxShadow: [
                            BoxShadow(
                              color: armyGreen.withValues(alpha: 0.35),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Icon(Icons.auto_stories_rounded, color: Colors.white, size: 36),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Pustaka Pangkalan',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: deepSlate,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Gerbang Ilmu Pengetahuan Desa Pangkalan • Literasi Digital Warga',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: oliveGray,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // 3. Auth Form Container
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(28),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 30,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // Animated Tab Toggle (Masuk / Daftar)
                            Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF0F5ED),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Row(
                                children: [
                                  _buildToggleButton('Masuk', _isLogin, () {
                                    setState(() {
                                      _isLogin = true;
                                      _phoneController.text = '081574627052';
                                      _passwordController.text = 'Kaydeen303';
                                    });
                                  }),
                                  _buildToggleButton('Daftar Anggota', !_isLogin, () {
                                    setState(() => _isLogin = false);
                                  }),
                                ],
                              ),
                            ),
                            const SizedBox(height: 24),

                            if (_isLogin) ...[
                              // LOGIN FORM
                              _buildInputField(
                                controller: _phoneController,
                                label: 'NIK / NOMOR HP',
                                icon: Icons.badge_outlined,
                                hint: '081574627052 atau 3202-xxxx-xxxx',
                                keyboardType: TextInputType.phone,
                              ),
                              const SizedBox(height: 16),
                              _buildInputField(
                                controller: _passwordController,
                                label: 'PASSWORD / PIN',
                                icon: Icons.lock_outline_rounded,
                                hint: 'Kaydeen303',
                                isPassword: true,
                                obscureText: !_isPasswordVisible,
                                onToggleVisibility: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                              ),
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Silakan hubungi Pengelola Perpustakaan di Balai Desa Pangkalan.')),
                                    );
                                  },
                                  child: Text(
                                    'Lupa PIN / Password?',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: armyGreen,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),

                              SizedBox(
                                width: double.infinity,
                                height: 50,
                                child: ElevatedButton(
                                  onPressed: authState.isLoading ? null : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: armyGreen,
                                    foregroundColor: Colors.white,
                                    elevation: 2,
                                    shadowColor: armyGreen.withValues(alpha: 0.4),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                  ),
                                  child: authState.isLoading
                                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              'Masuk Ke Perpustakaan',
                                              style: GoogleFonts.plusJakartaSans(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            const Icon(Icons.arrow_forward_rounded, size: 18),
                                          ],
                                        ),
                                ),
                              ),
                            ] else ...[
                              // REGISTER FORM
                              _buildInputField(
                                controller: _regNameController,
                                label: 'NAMA LENGKAP WARGA',
                                icon: Icons.person_outline_rounded,
                                hint: 'Contoh: Ahmad Subagyo',
                              ),
                              const SizedBox(height: 14),
                              _buildInputField(
                                controller: _regNikController,
                                label: 'NIK KTP DESA (OPSIONAL)',
                                icon: Icons.badge_outlined,
                                hint: '3202-2026-0042',
                                keyboardType: TextInputType.number,
                              ),
                              const SizedBox(height: 14),
                              _buildInputField(
                                controller: _regPhoneController,
                                label: 'NOMOR HP / WHATSAPP',
                                icon: Icons.phone_android_rounded,
                                hint: '085211223344',
                                keyboardType: TextInputType.phone,
                              ),
                              const SizedBox(height: 14),
                              _buildInputField(
                                controller: _regPasswordController,
                                label: 'BUAT PASSWORD / PIN',
                                icon: Icons.lock_outline_rounded,
                                hint: 'Minimal 6 Karakter',
                                isPassword: true,
                                obscureText: !_isPasswordVisible,
                                onToggleVisibility: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                              ),
                              const SizedBox(height: 20),

                              SizedBox(
                                width: double.infinity,
                                height: 50,
                                child: ElevatedButton(
                                  onPressed: authState.isLoading ? null : _handleRegister,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: darkEmerald,
                                    foregroundColor: Colors.white,
                                    elevation: 2,
                                    shadowColor: darkEmerald.withValues(alpha: 0.4),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                  ),
                                  child: authState.isLoading
                                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              'Daftar Anggota Desa Sekarang',
                                              style: GoogleFonts.plusJakartaSans(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            const Icon(Icons.how_to_reg_rounded, size: 18),
                                          ],
                                        ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      const SizedBox(height: 16),

                      // Guest / Back to Home option
                      OutlinedButton.icon(
                        onPressed: () async {
                          await ref.read(authProvider.notifier).loginAsGuest();
                          if (mounted) context.go('/');
                        },
                        icon: const Icon(Icons.arrow_back_rounded, color: armyGreen, size: 18),
                        label: Text(
                          '👁️ Lanjut sebagai Guest (Kembali ke Beranda)',
                          style: GoogleFonts.plusJakartaSans(color: armyGreen, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                          side: BorderSide(color: armyGreen.withValues(alpha: 0.3)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),

                      const SizedBox(height: 24),
                      // Help & Footer Info
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.info_outline, size: 14, color: oliveGray),
                          const SizedBox(width: 6),
                          Text(
                            'Butuh bantuan pendaftaran? ',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
                          ),
                          Text(
                            'Hubungi Balai Desa',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: armyGreen),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '© 2026 Perpustakaan Digital Desa Pangkalan • SLiMS Engine',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10,
                          color: oliveGray.withValues(alpha: 0.7),
                        ),
                      ),
                      const SizedBox(height: 16),
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

  Widget _buildToggleButton(String label, bool isSelected, VoidCallback onTap) {
    const armyGreen = Color(0xFF3B5836);
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isSelected
                ? [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)]
                : [],
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: isSelected ? armyGreen : const Color(0xFF8E958D),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
    bool isPassword = false,
    bool obscureText = false,
    VoidCallback? onToggleVisibility,
  }) {
    const armyGreen = Color(0xFF3B5836);
    const deepSlate = Color(0xFF181D18);
    const oliveGray = Color(0xFF596059);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: oliveGray,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: const Color(0xFFF6FBF2),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
          ),
          child: TextField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            style: GoogleFonts.plusJakartaSans(fontSize: 13, color: deepSlate, fontWeight: FontWeight.w600),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: GoogleFonts.plusJakartaSans(fontSize: 13, color: Colors.grey[400]),
              icon: Icon(icon, color: armyGreen, size: 18),
              suffixIcon: isPassword
                  ? IconButton(
                      icon: Icon(
                        obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: Colors.grey,
                        size: 18,
                      ),
                      onPressed: onToggleVisibility,
                    )
                  : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
      ],
    );
  }
}
