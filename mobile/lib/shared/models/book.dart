class Book {
  final String id;
  final String title;
  final String slug;
  final String? description;
  final String contentType;
  final int? publicationYear;
  final String? coverUrl;
  final int viewCount;
  final String? authorName;
  final String? publisherName;
  final String? categoryName;
  final String? categorySlug;
  final String? digitalAssetUrl;

  const Book({
    required this.id,
    required this.title,
    required this.slug,
    this.description,
    required this.contentType,
    this.publicationYear,
    this.coverUrl,
    this.viewCount = 0,
    this.authorName,
    this.publisherName = 'SLiMS Perpustakaan Desa Pangkalan',
    this.categoryName,
    this.categorySlug,
    this.digitalAssetUrl,
  });

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      contentType: json['contentType'] ?? 'BOOK',
      publicationYear: json['publicationYear'],
      coverUrl: json['coverUrl'],
      viewCount: json['viewCount'] ?? 0,
      authorName: json['author'] != null ? json['author']['name'] : (json['authorName']),
      publisherName: json['publisherName'] ?? 'SLiMS Perpustakaan Desa Pangkalan',
      categoryName: json['category'] != null ? json['category']['name'] : (json['categoryName']),
      categorySlug: json['category'] != null ? json['category']['slug'] : (json['categorySlug']),
      digitalAssetUrl: (json['digitalAssets'] != null && (json['digitalAssets'] as List).isNotEmpty)
          ? json['digitalAssets'][0]['fileUrl']
          : json['digitalAssetUrl'],
    );
  }
}
