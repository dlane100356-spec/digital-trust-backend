import 'package:shared_preferences/shared_preferences.dart';

class TrustService {
  static const String _scoreKey = 'trust_score';
  static const String _historyKey = 'trust_history';
  static const String _lastUpdateKey = 'trust_last_update';

  // ================= CURRENT SCORE =================

  static Future<int> getTrustScore() async {
    final prefs = await SharedPreferences.getInstance();

    // Run auto recovery before returning score
    await _autoRecoverTrust();

    return prefs.getInt(_scoreKey) ?? 50;
  }

  // ================= AUTO RECOVERY =================
  // +2 trust every 24 hours (max 100)

  static Future<void> _autoRecoverTrust() async {
    final prefs = await SharedPreferences.getInstance();

    int score = prefs.getInt(_scoreKey) ?? 50;
    final lastUpdateMillis = prefs.getInt(_lastUpdateKey);
    final now = DateTime.now();

    if (lastUpdateMillis != null) {
      final lastUpdate =
          DateTime.fromMillisecondsSinceEpoch(lastUpdateMillis);

      final hoursPassed = now.difference(lastUpdate).inHours;

      if (hoursPassed >= 24 && score < 100) {
        score += 2;
        if (score > 100) score = 100;

        await prefs.setInt(_scoreKey, score);
        await _addHistory(score, 'Auto Recovery');
      }
    }

    await prefs.setInt(
      _lastUpdateKey,
      now.millisecondsSinceEpoch,
    );
  }

  // ================= DECREASE TRUST =================
  // Called when a report is filed

  static Future<void> decreaseTrust(int amount) async {
    final prefs = await SharedPreferences.getInstance();

    int score = prefs.getInt(_scoreKey) ?? 50;
    score -= amount;

    if (score < 0) score = 0;

    await prefs.setInt(_scoreKey, score);
    await _addHistory(score, 'Report Filed');

    await prefs.setInt(
      _lastUpdateKey,
      DateTime.now().millisecondsSinceEpoch,
    );
  }

  // ================= HISTORY =================

  static Future<void> _addHistory(int score, String reason) async {
    final prefs = await SharedPreferences.getInstance();
    final history = prefs.getStringList(_historyKey) ?? [];

    history.add(
      '${DateTime.now().toIso8601String()}|$score|$reason',
    );

    await prefs.setStringList(_historyKey, history);
  }

  static Future<List<Map<String, dynamic>>> getTrustHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final history = prefs.getStringList(_historyKey) ?? [];

    return history.map((entry) {
      final parts = entry.split('|');

      return {
        'date': parts[0].split('T').first,
        'score': int.parse(parts[1]),
        'reason': parts.length > 2 ? parts[2] : '',
      };
    }).toList();
  }
}
