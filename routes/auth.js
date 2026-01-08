const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/firebase", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Missing Firebase token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const payload = {
      uid: decodedToken.uid,
      phone: decodedToken.phone_number || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: payload });
  } catch (error) {
    res.status(401).json({ message: "Invalid Firebase token" });
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ message: "Secure data access granted", user: req.user });
});

module.exports = router;
