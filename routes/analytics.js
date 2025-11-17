// routes/analytics.js - Analytics route definitions
const express = require("express");
const AnalyticsController = require("../controllers/analyticsController");
const router = express.Router();

// API: GET /api/dashboard (returns JSON)
router.get("/dashboard", AnalyticsController.getDashboard);

// other API endpoints
router.get("/analytics", AnalyticsController.getAnalytics);

module.exports = router;