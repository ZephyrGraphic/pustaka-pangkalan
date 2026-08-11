import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/models/book.dart';
import '../../../shared/models/category.dart';

export '../../../shared/models/book.dart';
export '../../../shared/models/category.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final sampleBooksDataset = <Book>[
  const Book(
    id: 'book-1',
    title: 'Belajar Bertani Organik Lengkap & Ramah Lingkungan',
    slug: 'belajar-bertani-organik-lengkap',
    description: 'Panduan praktis pembuatan pupuk kompos cair, pengolahan tanah ramah lingkungan, budidaya tanaman pangan lokal, serta pencegahan hama alami tanpa bahan kimia sintetis.',
    contentType: 'BOOK',
    publicationYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80',
    viewCount: 342,
    authorName: 'Ir. Budi Santoso, M.Si.',
    categoryName: 'Pertanian & Peternakan',
    categorySlug: 'pertanian',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-2',
    title: 'Panduan Manajemen & Pemasaran Digital UMKM Desa',
    slug: 'panduan-manajemen-pemasaran-umkm-desa',
    description: 'Langkah mudah mengelola keuangan usaha warga, pengemasan produk lokal yang menarik, serta strategi pemasaran digital melalui media sosial dan marketplace.',
    contentType: 'MODULE',
    publicationYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    viewCount: 512,
    authorName: 'Hj. Siti Rahmawati, S.E.',
    categoryName: 'Kewirausahaan & UMKM',
    categorySlug: 'umkm',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-3',
    title: 'Sejarah & Asal-Usul Desa Pangkalan (Edisi Lengkap)',
    slug: 'sejarah-dan-asal-usul-desa-pangkalan',
    description: 'Dokumentasi otentik perjalanan sejarah berdirinya Desa Pangkalan, kisah perjuangan para tokoh pendiri desa, silsilah leluhur, serta peninggalan situs budaya lokal.',
    contentType: 'LOCAL_HISTORY',
    publicationYear: 2025,
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
    viewCount: 820,
    authorName: 'Dr. H. Hartono & Tim Lembaga Adat',
    categoryName: 'Sejarah Desa',
    categorySlug: 'sejarah-desa',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-4',
    title: 'Dasar-Dasar Literasi Digital & Keamanan Siber Warga',
    slug: 'dasar-dasar-literasi-digital-warga-desa',
    description: 'Modul edukasi praktis penggunaan smartphone secara bijak, pencegahan penipuan online/phishing, serta perlindungan data pribadi untuk keluarga desa.',
    contentType: 'MODULE',
    publicationYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    viewCount: 290,
    authorName: 'Kominfo Desa & Tim IT Relawan',
    categoryName: 'Teknologi & Digital',
    categorySlug: 'teknologi',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-5',
    title: 'Panduan Gizi Keluarga & Pencegahan Stunting Anak',
    slug: 'panduan-gizi-keluarga-pencegahan-stunting',
    description: 'Buku saku kesehatan Posyandu Desa untuk pemenuhan gizi 1000 Hari Pertama Kehidupan (HPK), pola makan sehat anak, dan perawatan ibu hamil.',
    contentType: 'BOOK',
    publicationYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    viewCount: 415,
    authorName: 'dr. Anisa Permata (Kader Posyandu)',
    categoryName: 'Kesehatan & Gizi',
    categorySlug: 'kesehatan',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-6',
    title: 'Kumpulan Dongeng & Cerita Rakyat Pangkalan',
    slug: 'kumpulan-dongeng-cerita-rakyat-pangkalan',
    description: 'Buku cerita bergambar anak yang mengisahkan legenda teladan, fabel kearifan lokal, dan kisah keberanian pahlawan desa Pangkalan.',
    contentType: 'BOOK',
    publicationYear: 2025,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    viewCount: 630,
    authorName: 'Sanggar Seni & Sastra Pangkalan',
    categoryName: 'Anak & Remaja',
    categorySlug: 'anak',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
  const Book(
    id: 'book-7',
    title: 'Kerajinan Tangan & Pelestarian Budaya Lokal',
    slug: 'kerajinan-tangan-pelestarian-budaya-lokal',
    description: 'Panduan teknis seni ukir, Anyaman bambu tradisional, pembuatan batik khas desa, dan tata cara pementasan kesenian daerah.',
    contentType: 'BOOK',
    publicationYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&q=80',
    viewCount: 185,
    authorName: 'Ki Bambang Sujiwo',
    categoryName: 'Seni & Budaya Lokal',
    categorySlug: 'budaya',
    digitalAssetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ),
];

final sampleCategoriesDataset = <CategoryModel>[
  const CategoryModel(id: 'cat-1', name: 'Pertanian & Peternakan', slug: 'pertanian', icon: '🌾', description: 'Panduan bercocok tanam dan peternakan'),
  const CategoryModel(id: 'cat-2', name: 'Kewirausahaan & UMKM', slug: 'umkm', icon: '💼', description: 'Manajemen usaha dan pemasaran produk desa'),
  const CategoryModel(id: 'cat-3', name: 'Sejarah Desa', slug: 'sejarah-desa', icon: '🏛️', description: 'Dokumentasi sejarah dan tradisi desa'),
  const CategoryModel(id: 'cat-4', name: 'Teknologi & Digital', slug: 'teknologi', icon: '💻', description: 'Literasi digital dan edukasi smartphone'),
  const CategoryModel(id: 'cat-5', name: 'Kesehatan & Gizi', slug: 'kesehatan', icon: '🏥', description: 'Kesehatan keluarga dan pencegahan stunting'),
  const CategoryModel(id: 'cat-6', name: 'Anak & Remaja', slug: 'anak', icon: '👶', description: 'Buku cerita dan bacaan anak desa'),
  const CategoryModel(id: 'cat-7', name: 'Seni & Budaya Lokal', slug: 'budaya', icon: '🎨', description: 'Kesenian dan tradisi lokal'),
];

final categoriesProvider = FutureProvider<List<CategoryModel>>((ref) async {
  final api = ref.watch(apiClientProvider);
  try {
    final response = await api.dio.get(ApiConstants.categories);
    if (response.data['success'] == true && (response.data['data'] as List).isNotEmpty) {
      return (response.data['data'] as List)
          .map((json) => CategoryModel.fromJson(json))
          .toList();
    }
  } catch (_) {}
  return sampleCategoriesDataset;
});

final booksProvider = FutureProvider.family<List<Book>, String?>((ref, categorySlug) async {
  final api = ref.watch(apiClientProvider);
  final queryParams = <String, dynamic>{'page': 1, 'limit': 20};
  if (categorySlug != null && categorySlug.isNotEmpty) {
    queryParams['category'] = categorySlug;
  }

  try {
    final response = await api.dio.get(ApiConstants.contents, queryParameters: queryParams);
    if (response.data['success'] == true && (response.data['data'] as List).isNotEmpty) {
      return (response.data['data'] as List)
          .map((json) => Book.fromJson(json))
          .toList();
    }
  } catch (_) {}

  // Fallback Dataset
  if (categorySlug != null && categorySlug.isNotEmpty) {
    return sampleBooksDataset.where((b) => b.categorySlug == categorySlug).toList();
  }
  return sampleBooksDataset;
});

final searchBooksProvider = FutureProvider.family<List<Book>, String>((ref, query) async {
  if (query.trim().isEmpty) return sampleBooksDataset;
  final api = ref.watch(apiClientProvider);
  try {
    final response = await api.dio.get(ApiConstants.search, queryParameters: {'q': query});
    if (response.data['success'] == true && (response.data['data'] as List).isNotEmpty) {
      return (response.data['data'] as List)
          .map((json) => Book.fromJson(json))
          .toList();
    }
  } catch (_) {}

  final q = query.toLowerCase();
  return sampleBooksDataset.where((b) {
    final t = b.title.toLowerCase();
    final a = (b.authorName ?? '').toLowerCase();
    final d = (b.description ?? '').toLowerCase();
    return t.contains(q) || a.contains(q) || d.contains(q);
  }).toList();
});

final bookDetailProvider = FutureProvider.family<Book?, String>((ref, id) async {
  if (id.trim().isEmpty) return sampleBooksDataset.first;
  final api = ref.watch(apiClientProvider);
  try {
    final response = await api.dio.get('${ApiConstants.contents}/$id');
    if (response.data['success'] == true) {
      return Book.fromJson(response.data['data']);
    }
  } catch (_) {}

  return sampleBooksDataset.firstWhere(
    (b) => b.id == id,
    orElse: () => sampleBooksDataset.first,
  );
});
