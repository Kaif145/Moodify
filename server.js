// server.js - TOP (after dotenv and imports)
const dotenv = require("dotenv");
dotenv.config();



const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");  // Make sure multer is required!

const app = express();
const PORT = process.env.PORT || 3000;

// ——————— MULTER CONFIG (THIS IS THE FIX!) ———————
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const safeName = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
      cb(null, safeName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, png, webp)"));
    }
  }
});
// —————————————————————————————————————————————

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Import Controller
const UploadController = require("./controllers/uploadController");

// ——————— THIS IS YOUR WORKING UPLOAD ROUTE ———————
app.post("/api/upload", upload.single("photo"), UploadController.handlePhotoUpload);
// ———————————————————————————————————————————————

const AnalyticsController = require("./controllers/analyticsController");



// At the top with other requires
const notesRoutes = require("./routes/notes");

// Mount it (this gives you /api/vibe and /api/trending)
app.use("/api", notesRoutes);

// Your other routes...
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/test", (req, res) => {
  res.json({ success: true, message: "Server + Multer working!" });
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/dashboard', AnalyticsController.getDashboard);


// Error handler last
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: POST /api/upload (with form-data key: 'photo')`);
});