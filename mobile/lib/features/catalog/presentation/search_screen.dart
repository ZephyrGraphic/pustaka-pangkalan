import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../shared/models/book.dart';
import '../providers/catalog_provider.dart';

class SearchScreen extends ConsumerStatefulWidget {
  final String? initialCategory;

  const SearchScreen({super.key, this.initialCategory});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  late TextEditingController _searchController;
  bool isGridView = true;
  String selectedFilter = 'Semua';

  final List<String> categoriesList = [
    'Semua',
    'Pertanian',
    'Sastra & Budaya',
    'Wirausaha',
    'Kesehatan',
    'Teknologi',
    'Hukum Desa',
    'Tersedia Offline'
  ];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    if (widget.initialCategory != null) {
      selectedFilter = widget.initialCategory!;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const armyGreen = Color(0xFF3B5836);
    const sageWhite = Color(0xFFF7F9F7);
    const oliveGray = Color(0xFF8E958D);
    const deepSlate = Color(0xFF1F241F);

    final booksAsync = ref.watch(booksProvider(_searchController.text));

    return Scaffold(
      backgroundColor: sageWhite,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Sticky Search Header
            Container(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 14),
              decoration: BoxDecoration(
                color: sageWhite,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.black.withOpacity(0.06)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.03),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: TextField(
                            controller: _searchController,
                            onChanged: (val) {
                              setState(() {});
                            },
                            decoration: InputDecoration(
                              hintText: 'Cari modul, e-book, atau arsip...',
                              hintStyle: GoogleFonts.plusJakartaSans(color: oliveGray, fontSize: 13),
                              icon: const Icon(Icons.search_rounded, color: armyGreen, size: 20),
                              border: InputBorder.none,
                              suffixIcon: _searchController.text.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.close_rounded, size: 18, color: oliveGray),
                                      onPressed: () {
                                        _searchController.clear();
                                        setState(() {});
                                      },
                                    )
                                  : null,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Filter Chips Scrollable
                  SizedBox(
                    height: 36,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: categoriesList.length,
                      separatorBuilder: (context, index) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final category = categoriesList[index];
                        final isSelected = selectedFilter == category;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedFilter = category;
                            });
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSelected ? armyGreen : Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected ? armyGreen : Colors.black.withOpacity(0.06),
                              ),
                            ),
                            child: Text(
                              category,
                              style: GoogleFonts.plusJakartaSans(
                                color: isSelected ? Colors.white : deepSlate,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // 2. Control Bar (Total Results & View Mode Toggle)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Katalog Koleksi Desa',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: deepSlate,
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          Icons.grid_view_rounded,
                          color: isGridView ? armyGreen : oliveGray,
                          size: 20,
                        ),
                        onPressed: () => setState(() => isGridView = true),
                      ),
                      IconButton(
                        icon: Icon(
                          Icons.format_list_bulleted_rounded,
                          color: !isGridView ? armyGreen : oliveGray,
                          size: 20,
                        ),
                        onPressed: () => setState(() => isGridView = false),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 3. Books Grid / List View
            Expanded(
              child: booksAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => Center(
                  child: Text('Gagal memuat katalog: $err', style: GoogleFonts.plusJakartaSans(color: Colors.red)),
                ),
                data: (books) {
                  final filteredBooks = books.where((book) {
                    if (selectedFilter == 'Semua') return true;
                    if (selectedFilter == 'Tersedia Offline') return true;
                    return (book.categoryName ?? '').toLowerCase().contains(selectedFilter.toLowerCase());
                  }).toList();

                  if (filteredBooks.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off_rounded, size: 60, color: oliveGray.withOpacity(0.5)),
                          const SizedBox(height: 12),
                          Text(
                            'Koleksi Tidak Ditemukan',
                            style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.bold, color: deepSlate),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Coba kata kunci lain atau pilih kategori lain.',
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: oliveGray),
                          ),
                        ],
                      ),
                    );
                  }

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: isGridView
                        ? GridView.builder(
                            physics: const BouncingScrollPhysics(),
                            padding: const EdgeInsets.only(bottom: 100),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.68,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                            ),
                            itemCount: filteredBooks.length,
                            itemBuilder: (context, index) {
                              final book = filteredBooks[index];
                              return _buildGridCard(context, book, armyGreen, deepSlate, oliveGray);
                            },
                          )
                        : ListView.separated(
                            physics: const BouncingScrollPhysics(),
                            padding: const EdgeInsets.only(bottom: 100),
                            itemCount: filteredBooks.length,
                            separatorBuilder: (context, index) => const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final book = filteredBooks[index];
                              return _buildListCard(context, book, armyGreen, deepSlate, oliveGray);
                            },
                          ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridCard(BuildContext context, Book book, Color armyGreen, Color deepSlate, Color oliveGray) {
    return GestureDetector(
      onTap: () => context.push('/content/${book.id}'),
      child: Container(
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                    child: SizedBox(
                      width: double.infinity,
                      child: Image.network(
                        book.coverUrl ?? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: armyGreen.withOpacity(0.1),
                          child: Icon(Icons.book, color: armyGreen, size: 50),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.offline_pin_rounded, color: Colors.greenAccent, size: 10),
                          const SizedBox(width: 3),
                          Text(
                            'PDF 3.2 MB',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
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
                      fontSize: 13,
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                          const SizedBox(width: 2),
                          Text(
                            '4.8',
                            style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: deepSlate),
                          ),
                        ],
                      ),
                      Icon(Icons.bookmark_border_rounded, size: 18, color: armyGreen),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListCard(BuildContext context, Book book, Color armyGreen, Color deepSlate, Color oliveGray) {
    return GestureDetector(
      onTap: () => context.push('/content/${book.id}'),
      child: Container(
        padding: const EdgeInsets.all(12),
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
              borderRadius: BorderRadius.circular(12),
              child: SizedBox(
                width: 60,
                height: 80,
                child: Image.network(
                  book.coverUrl ?? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: armyGreen.withOpacity(0.1),
                    child: Icon(Icons.book, color: armyGreen),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    book.title,
                    style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold, color: deepSlate),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${book.authorName ?? "Penulis Desa"} • ${book.categoryName ?? "Umum"}',
                    style: GoogleFonts.plusJakartaSans(fontSize: 11, color: oliveGray),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                      const SizedBox(width: 3),
                      Text('4.8', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: deepSlate)),
                      const SizedBox(width: 12),
                      Icon(Icons.offline_pin_rounded, color: armyGreen, size: 14),
                      const SizedBox(width: 3),
                      Text('Offline PDF', style: GoogleFonts.plusJakartaSans(fontSize: 10, color: armyGreen, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: oliveGray),
          ],
        ),
      ),
    );
  }
}
