const express = require('express');
const { protect } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// All routes are protected (require JWT authentication)
router.get('/sales-trend', protect, analyticsController.getTrend);
router.get('/revenue-by-product', protect, analyticsController.getProductRevenue);
router.get('/lead-sources', protect, analyticsController.getSources);
router.get('/conversion-funnel', protect, analyticsController.getFunnel);

module.exports = router;
