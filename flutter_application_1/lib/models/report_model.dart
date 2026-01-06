class ReportModel {
  final String reason;
  final DateTime reportedAt;

  ReportModel({
    required this.reason,
    required this.reportedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'reason': reason,
      'reportedAt': reportedAt.toIso8601String(),
    };
  }
}
