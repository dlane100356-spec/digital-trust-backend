import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// LOAD ENV VARIABLES
dotenv.config();

// CREATE APP
const app = express();

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

// ===== ROUTE IMPORTS =====
import protectedRoutes from "./src/routes/api/protected.js";

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Digital Trust Backend",
  });
});

// ===== API ROUTES =====
app.use("/api/protected", protectedRoutes);

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
