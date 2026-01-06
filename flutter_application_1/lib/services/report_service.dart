import 'package:shared_preferences/shared_preferences.dart';
import 'trust_service.dart';

class ReportService {
  static const String _reportKey = 'reports';

  // ================= ADD REPORT =================

  static Future<void> addReport(String reason) async {
    final prefs = await SharedPreferences.getInstance();
    final reports = prefs.getStringList(_reportKey) ?? [];

    reports.add(
      '${DateTime.now().toIso8601String()}|$reason',
    );

    await prefs.setStringList(_reportKey, reports);

    // ✅ AUTO-DECREASE TRUST WHEN REPORT IS FILED
    await TrustService.decreaseTrust(10);
  }

  // ================= GET REPORTS =================

  static Future<List<String>> getReports() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_reportKey) ?? [];
  }
}
