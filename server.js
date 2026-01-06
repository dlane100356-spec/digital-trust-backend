import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(bodyParser.json());

/* =========================
   DATABASE CONNECTION
========================= */
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digital_trust";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.send("✅ Digital Trust Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend + Database connection successful",
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
