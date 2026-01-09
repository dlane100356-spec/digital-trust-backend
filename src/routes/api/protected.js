import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

export default router;
