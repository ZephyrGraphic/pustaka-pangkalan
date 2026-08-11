import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PdfReaderScreen extends StatefulWidget {
  final String contentId;
  final String bookTitle;

  const PdfReaderScreen({
    super.key,
    required this.contentId,
    required this.bookTitle,
  });

  @override
  State<PdfReaderScreen> createState() => _PdfReaderScreenState();
}

class _PdfReaderScreenState extends State<PdfReaderScreen> {
  bool _showControls = true;
  double _currentPage = 42.0;
  final double _totalPages = 120.0;
  String _currentTheme = 'Light'; // Light, Sepia, Night
  double _fontSizeFactor = 1.0;
  bool _isBookmarked = false;

  void _toggleControls() {
    setState(() {
      _showControls = !_showControls;
    });
  }

  @override
  Widget build(BuildContext context) {
    const armyGreen = Color(0xFF3B5836);

    // Theme Colors Mapping
    final Map<String, Map<String, Color>> themes = {
      'Light': {
        'bg': const Color(0xFFFFFFFF),
        'text': const Color(0xFF1F241F),
        'surface': const Color(0xFFF7F9F7),
        'accent': armyGreen,
      },
      'Sepia': {
        'bg': const Color(0xFFF4ECD8),
        'text': const Color(0xFF5B4636),
        'surface': const Color(0xFFE8DFC8),
        'accent': const Color(0xFF8C6D46),
      },
      'Night': {
        'bg': const Color(0xFF121212),
        'text': const Color(0xFFE0E0E0),
        'surface': const Color(0xFF1F1F1F),
        'accent': const Color(0xFF4E7348),
      }
    };

    final currentColors = themes[_currentTheme]!;

    return Scaffold(
      backgroundColor: currentColors['bg'],
      body: Stack(
        children: [
          // 1. Reading Canvas (Interactive PDF Reader Canvas)
          GestureDetector(
            onTap: _toggleControls,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 100, 24, 140),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'BAB III: METODE PERTANIAN RAMAH LINGKUNGAN',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12 * _fontSizeFactor,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                        color: currentColors['accent'],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Implementasi pertanian organik di tingkat desa memerlukan pemahaman mendalam tentang siklus nutrisi alami. Penggunaan pupuk hijau dan kompos bukan sekadar mengganti bahan kimia, melainkan membangun kembali ekosistem tanah yang telah lama terdegradasi.',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 16 * _fontSizeFactor,
                        height: 1.8,
                        color: currentColors['text'],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Illustration Container
                    Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: currentColors['surface'],
                        borderRadius: BorderRadius.circular(16),
                        image: const DecorationImage(
                          image: NetworkImage('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop'),
                          fit: BoxFit.cover,
                          opacity: 0.85,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Text(
                      'Petani di Desa Pangkalan telah membuktikan bahwa dengan rotasi tanaman yang tepat, serangan hama dapat ditekan hingga 40% tanpa menggunakan pestisida sintetis. Hal ini berdampak langsung pada biaya produksi yang menurun dan harga jual produk yang lebih premium di pasar kota.',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 16 * _fontSizeFactor,
                        height: 1.8,
                        color: currentColors['text'],
                      ),
                    ),
                    const SizedBox(height: 20),

                    Text(
                      'Langkah pertama dalam pembuatan pupuk organik padat:',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 15 * _fontSizeFactor,
                        fontWeight: FontWeight.bold,
                        color: currentColors['text'],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '1. Kumpulkan sisa jerami dan daun hijau leguminosa.\n2. Campurkan dengan kotoran sapi atau kambing (rasio 3:1).\n3. Tambahkan larutan gula merah dan bioaktivator EM4.\n4. Tutup rapat dengan terpal selama 14 hari dengan pengadukan berkala.',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 15 * _fontSizeFactor,
                        height: 1.7,
                        color: currentColors['text'],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 2. Top Bar Controls Overlay (Auto-Hiding)
          AnimatedPositioned(
            duration: const Duration(milliseconds: 250),
            top: _showControls ? 0 : -100,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.only(top: 45, bottom: 12, left: 16, right: 16),
              decoration: BoxDecoration(
                color: currentColors['bg']!.withValues(alpha: 0.95),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.arrow_back_rounded, color: currentColors['text']),
                    onPressed: () => Navigator.pop(context),
                  ),
                  Expanded(
                    child: Text(
                      widget.bookTitle,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: currentColors['text'],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                      color: _isBookmarked ? armyGreen : currentColors['text'],
                    ),
                    onPressed: () {
                      setState(() {
                        _isBookmarked = !_isBookmarked;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_isBookmarked
                              ? 'Halaman ${_currentPage.toInt()} di-bookmark!'
                              : 'Bookmark dihapus.'),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),

          // 3. Bottom Controls Toolbar Overlay
          AnimatedPositioned(
            duration: const Duration(milliseconds: 250),
            bottom: _showControls ? 0 : -200,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: currentColors['bg']!.withValues(alpha: 0.96),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 20,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Page Slider Bar
                  Row(
                    children: [
                      Text(
                        'Hlm ${_currentPage.toInt()}',
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.bold,
                          color: currentColors['text'],
                          fontSize: 12,
                        ),
                      ),
                      Expanded(
                        child: SliderTheme(
                          data: SliderThemeData(
                            activeTrackColor: currentColors['accent'],
                            inactiveTrackColor: currentColors['surface'],
                            thumbColor: currentColors['accent'],
                            trackHeight: 4,
                          ),
                          child: Slider(
                            value: _currentPage,
                            min: 1.0,
                            max: _totalPages,
                            onChanged: (val) {
                              setState(() {
                                _currentPage = val;
                              });
                            },
                          ),
                        ),
                      ),
                      Text(
                        '${_totalPages.toInt()}',
                        style: GoogleFonts.plusJakartaSans(
                          color: currentColors['text']!.withValues(alpha: 0.6),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Reading Controls Group (Theme Mode & Font Size)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Theme Selector Pills
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: currentColors['surface'],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: ['Light', 'Sepia', 'Night'].map((themeName) {
                            final isSelected = _currentTheme == themeName;
                            return GestureDetector(
                              onTap: () => setState(() => _currentTheme = themeName),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isSelected ? currentColors['accent'] : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  themeName,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                    color: isSelected ? Colors.white : currentColors['text'],
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),

                      // Font Size Adjuster Controls
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: currentColors['surface'],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                if (_fontSizeFactor > 0.8) {
                                  setState(() => _fontSizeFactor -= 0.1);
                                }
                              },
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                child: Text('A-', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 12, color: currentColors['text'])),
                              ),
                            ),
                            Container(height: 14, width: 1, color: currentColors['text']!.withValues(alpha: 0.2)),
                            GestureDetector(
                              onTap: () {
                                if (_fontSizeFactor < 1.5) {
                                  setState(() => _fontSizeFactor += 0.1);
                                }
                              },
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                child: Text('A+', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 15, color: currentColors['text'])),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
