const express = require('express');
const { getLeads, addLead, getStats } = require('../controllers/leadsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require JWT authentication)
router.get('/', protect, getLeads);
router.post('/', protect, addLead);
router.get('/stats', protect, getStats);

module.exports = router;
