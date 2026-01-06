class UserModel {
  final String userId;
  final String phone;
  final bool isVerified;
  final int trustScore;

  UserModel({
    required this.userId,
    required this.phone,
    required this.isVerified,
    required this.trustScore,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['user_id'] ?? '',
      phone: json['phone'] ?? '',
      isVerified: json['is_verified'] ?? false,
      trustScore: json['trust_score'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'phone': phone,
      'is_verified': isVerified,
      'trust_score': trustScore,
    };
  }
}
