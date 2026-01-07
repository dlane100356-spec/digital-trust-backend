import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE (MUST BE FIRST)
========================= */
app.use(cors());
app.use(express.json()); // 🚨 REQUIRED

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is live");
});

/* =========================
   AUTH ROUTES
========================= */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔍 DEBUG LOG (IMPORTANT)
    console.log("BODY RECEIVED:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: { name, email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
