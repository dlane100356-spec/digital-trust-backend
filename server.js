import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ROOT ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is live and connected");
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/* =========================
   AUTH ROUTES
========================= */
app.use("/api/auth", authRoutes);

/* =========================
   DATABASE CONNECTION
========================= */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
