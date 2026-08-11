class User {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String role;
  final String? avatarUrl;

  const User({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    required this.role,
    this.avatarUrl,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'],
      role: json['role'] ?? 'USER',
      avatarUrl: json['avatarUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'role': role,
      'avatarUrl': avatarUrl,
    };
  }
}
