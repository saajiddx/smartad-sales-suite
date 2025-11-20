const { getAllSales, createSale, getSalesStats } = require('../models/database');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res, next) => {
  try {
    const sales = getAllSales();
    res.json({ success: true, sales });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const addSale = async (req, res, next) => {
  try {
    const { product, amount, date, customer, status } = req.body;
    
    if (!product || !amount || !date || !customer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newSale = createSale({
      product,
      amount: parseFloat(amount),
      date,
      customer,
      status: status || 'pending'
    });
    
    res.json({ success: true, sale: newSale });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const stats = getSalesStats();
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSales,
  addSale,
  getStats
};