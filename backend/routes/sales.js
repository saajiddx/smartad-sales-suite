const express = require('express');
const { getSales, addSale, getStats } = require('../controllers/salesController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require JWT authentication)
router.get('/', protect, getSales);
router.post('/', protect, addSale);
router.get('/stats', protect, getStats);

module.exports = router;