class CategoryModel {
  final String id;
  final String name;
  final String slug;
  final String? icon;
  final String? description;
  final int totalContent;

  const CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.description,
    this.totalContent = 0,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      icon: json['icon'],
      description: json['description'],
      totalContent: json['totalContent'] ?? 0,
    );
  }
}
