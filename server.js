require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const authRoutes = require("./routes/auth");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Firebase Admin */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

/* MongoDB */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* Root */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Digital Trust Backend",
  });
});

/* Health */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

/* Auth routes */
app.use("/api/auth", authRoutes);

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
