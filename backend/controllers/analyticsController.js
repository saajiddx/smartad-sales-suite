const { getSalesTrend, getRevenueByProduct, getLeadSources, getConversionFunnel } = require('../models/database');

// @desc    Get sales trend over time
// @route   GET /api/analytics/sales-trend
// @access  Private
const getTrend = async (req, res, next) => {
  try {
    const trend = getSalesTrend();
    res.json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue by product
// @route   GET /api/analytics/revenue-by-product
// @access  Private
const getProductRevenue = async (req, res, next) => {
  try {
    const data = getRevenueByProduct();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead sources distribution
// @route   GET /api/analytics/lead-sources
// @access  Private
const getSources = async (req, res, next) => {
  try {
    const data = getLeadSources();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversion funnel
// @route   GET /api/analytics/conversion-funnel
// @access  Private
const getFunnel = async (req, res, next) => {
  try {
    const data = getConversionFunnel();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrend,
  getProductRevenue,
  getSources,
  getFunnel
};
