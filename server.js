require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Root route */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Digital Trust Backend",
  });
});

/* Health route — DEFINE DIRECTLY */
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;

  res.json({
    status: "healthy",
    service: "Digital Trust Backend",
    database:
      state === 1
        ? "connected"
        : state === 2
        ? "connecting"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/* Auth routes */
app.use("/api/auth", authRoutes);

/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) =>
    console.error("MongoDB connection failed:", err.message)
  );

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
