require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Digital Trust Backend running 🚀",
  });
});

// ✅ HEALTH ROUTE
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
