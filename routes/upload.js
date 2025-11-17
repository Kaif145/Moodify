// routes/upload.js - Upload route definitions
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AnalyticsService = require("../services/analyticsService");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Main upload endpoint
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const { description = "", preference = "", language = "mixed" } = req.body;
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadsDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save file
    fs.writeFileSync(filePath, req.file.buffer);

    // Track analytics in background (non-blocking)
    AnalyticsService.trackPhotoUpload(
      description,
      preference,
      language,
      req.headers["user-agent"] || "",
      req.ip || req.headers["x-forwarded-for"] || ""
    ).catch(err => console.error("Analytics error:", err));

    // Return immediately
    res.json({
      success: true,
      message: "Photo uploaded successfully",
      filename
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;