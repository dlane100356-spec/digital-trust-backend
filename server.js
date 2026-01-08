require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const healthRoutes = require("./routes/health");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

/* Root route */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Digital Trust Backend",
  });
});

/* MongoDB connection */
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
