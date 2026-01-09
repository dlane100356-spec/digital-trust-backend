const express = require("express");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* Health / ping route */
router.get("/", (req, res) => {
  res.json({
    status: "OK",
    route: "/api/auth",
    message: "Auth service is running",
  });
});

/* Verify Firebase token and issue JWT */
router.post("/", async (req, res) => {
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
  } catch (err) {
    res.status(401).json({ message: "Invalid Firebase token" });
  }
});

module.exports = router;
