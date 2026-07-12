class User {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? departmentId;
  final String status;
  final bool isFirstLogin;
  final String? role;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.departmentId,
    required this.status,
    required this.isFirstLogin,
    this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      departmentId: json['department_id'],
      status: json['status'] ?? 'ACTIVE',
      isFirstLogin: json['is_first_login'] ?? true,
      role: json['role'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'department_id': departmentId,
      'status': status,
      'is_first_login': isFirstLogin,
      'role': role,
    };
  }
}
