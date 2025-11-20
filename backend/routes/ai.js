const express = require('express');
const { generateInsights, generateAdCopy, getInsights, getAdCopies } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require JWT authentication)
router.post('/insights', protect, generateInsights);
router.post('/adcopy', protect, generateAdCopy);
router.get('/insights', protect, getInsights);
router.get('/adcopies', protect, getAdCopies);

module.exports = router;