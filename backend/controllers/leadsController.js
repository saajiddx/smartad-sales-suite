const { getAllLeads, createLead, getLeadsStats } = require('../models/database');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const leads = getAllLeads();
    res.json({ success: true, leads });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const addLead = async (req, res, next) => {
  try {
    const { name, email, phone, source, status, notes } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const newLead = createLead({
      name,
      email,
      phone: phone || '',
      source: source || 'Direct',
      status: status || 'new',
      notes: notes || ''
    });
    
    res.json({ success: true, lead: newLead });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const stats = getLeadsStats();
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  addLead,
  getStats
};
