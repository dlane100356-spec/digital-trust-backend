const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/user/me
 * Protected route
 */
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    uid: req.user.uid,
    phone: req.user.phone,
  });
});

module.exports = router;
