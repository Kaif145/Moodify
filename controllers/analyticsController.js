// controllers/analyticsController.js - Analytics dashboard controller
const AnalyticsService = require("../services/analyticsService");

class AnalyticsController {
  // Make async and await the service
  static async getAnalytics(req, res) {
    try {
      const analytics = await AnalyticsService.getAnalytics();
      
      res.json({
        success: true,
        data: analytics,
        summary: {
          totalUploads: analytics.totalUploads || 0,
          avgPerDay: analytics.insights?.avgUploadsPerDay || 0,
          topMood: analytics.insights?.topMood || 'none',
          topPhotoType: analytics.insights?.topPhotoType || 'none',
          mostActiveTime: Object.entries(analytics.timeOfDay || {})
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown'
        }
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Could not retrieve analytics'
      });
    }
  }

  // Provide a simple dashboard endpoint (returns JSON; you can render HTML later)
  static async getDashboard(req, res) {
    try {
      const analytics = await AnalyticsService.getAnalytics();
      res.json({ success: true, dashboard: analytics });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ success: false, error: 'Could not build dashboard' });
    }
  }
}

module.exports = AnalyticsController;