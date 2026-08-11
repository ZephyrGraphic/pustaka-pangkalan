class ReadingProgressModel {
  final String contentId;
  final String title;
  final String? coverUrl;
  final String? authorName;
  final String? categoryName;
  final int currentPage;
  final int totalPages;
  final double progressPercent;
  final String status;
  final DateTime? lastReadAt;

  const ReadingProgressModel({
    required this.contentId,
    required this.title,
    this.coverUrl,
    this.authorName,
    this.categoryName,
    required this.currentPage,
    required this.totalPages,
    required this.progressPercent,
    required this.status,
    this.lastReadAt,
  });

  factory ReadingProgressModel.fromJson(Map<String, dynamic> json) {
    return ReadingProgressModel(
      contentId: json['contentId'] ?? '',
      title: json['title'] ?? '',
      coverUrl: json['coverUrl'],
      authorName: json['authorName'],
      categoryName: json['categoryName'],
      currentPage: json['currentPage'] ?? 1,
      totalPages: json['totalPages'] ?? 1,
      progressPercent: (json['progressPercent'] ?? 0.0).toDouble(),
      status: json['status'] ?? 'READING',
      lastReadAt: json['lastReadAt'] != null ? DateTime.tryParse(json['lastReadAt']) : null,
    );
  }
}
