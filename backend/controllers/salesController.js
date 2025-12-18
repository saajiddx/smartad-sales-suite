const { getAllSales, createSale, getSalesStats, getSaleById } = require('../models/database');

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

// @desc    Create new sale with customer details
// @route   POST /api/sales
// @access  Private
const addSale = async (req, res, next) => {
  try {
    const { product, amount, date, customer, customerPhone, customerAddress, status } = req.body;
    
    if (!product || !amount || !date || !customer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newSale = createSale({
      product,
      amount: parseFloat(amount),
      date,
      customer,
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',
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

// @desc    Get single sale details
// @route   GET /api/sales/:id
// @access  Private
const getSaleDetails = async (req, res, next) => {
  try {
    const sale = getSaleById(parseInt(req.params.id));
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    res.json({ success: true, sale });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSales,
  addSale,
  getStats,
  getSaleDetails
};