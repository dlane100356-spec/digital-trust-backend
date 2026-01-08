const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: "healthy",
    service: "Digital Trust Backend",
    database:
      dbState === 1
        ? "connected"
        : dbState === 2
        ? "connecting"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
