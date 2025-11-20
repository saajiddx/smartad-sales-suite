const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Initialize database
const initDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    JSON.parse(data);
  } catch (error) {
    console.log('Initializing fresh database...');
    const initialData = {
      users: [],
      sales: [],
      leads: [],
      insights: [],
      adCopies: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
};

// Read database
const readDB = () => {
  initDB();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// USER OPERATIONS
const findUserByEmail = (email) => {
  const db = readDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  const db = readDB();
  return db.users.find(u => u.id === id);
};

const createUser = (userData) => {
  const db = readDB();
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    ...userData,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
};

// SALES OPERATIONS
const getAllSales = () => {
  const db = readDB();
  return db.sales;
};

const createSale = (saleData) => {
  const db = readDB();
  const newSale = {
    id: db.sales.length > 0 ? Math.max(...db.sales.map(s => s.id)) + 1 : 1,
    ...saleData,
    createdAt: new Date().toISOString()
  };
  db.sales.push(newSale);
  writeDB(db);
  return newSale;
};

const getSalesStats = () => {
  const db = readDB();
  const sales = db.sales;
  
  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const completedSales = sales.filter(s => s.status === 'completed');
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.amount, 0);
  
  return {
    totalSales,
    totalCount: sales.length,
    completedCount: completedSales.length,
    pendingCount: sales.filter(s => s.status === 'pending').length,
    monthlyRevenue,
    averageSale: sales.length > 0 ? totalSales / sales.length : 0
  };
};

// LEADS OPERATIONS
const getAllLeads = () => {
  const db = readDB();
  return db.leads;
};

const createLead = (leadData) => {
  const db = readDB();
  const newLead = {
    id: db.leads.length > 0 ? Math.max(...db.leads.map(l => l.id)) + 1 : 1,
    ...leadData,
    createdAt: new Date().toISOString()
  };
  db.leads.push(newLead);
  writeDB(db);
  return newLead;
};

const getLeadsStats = () => {
  const db = readDB();
  const leads = db.leads;
  
  const sources = {};
  leads.forEach(lead => {
    sources[lead.source] = (sources[lead.source] || 0) + 1;
  });
  
  return {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    contactedLeads: leads.filter(l => l.status === 'contacted').length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    sources,
    conversionRate: leads.length > 0 ? 
      (leads.filter(l => l.status === 'qualified').length / leads.length * 100).toFixed(2) : 0
  };
};

// AI OPERATIONS
const createInsight = (insightData) => {
  const db = readDB();
  const newInsight = {
    id: db.insights.length > 0 ? Math.max(...db.insights.map(i => i.id)) + 1 : 1,
    ...insightData,
    createdAt: new Date().toISOString()
  };
  db.insights.push(newInsight);
  writeDB(db);
  return newInsight;
};

const getAllInsights = () => {
  const db = readDB();
  return db.insights.reverse();
};

const createAdCopy = (adCopyData) => {
  const db = readDB();
  const newAdCopy = {
    id: db.adCopies.length > 0 ? Math.max(...db.adCopies.map(a => a.id)) + 1 : 1,
    ...adCopyData,
    createdAt: new Date().toISOString()
  };
  db.adCopies.push(newAdCopy);
  writeDB(db);
  return newAdCopy;
};

const getAllAdCopies = () => {
  const db = readDB();
  return db.adCopies.reverse();
};

// ANALYTICS OPERATIONS
const getSalesTrend = () => {
  const db = readDB();
  const sales = db.sales;
  
  const monthlyData = {};
  sales.forEach(sale => {
    const date = new Date(sale.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, count: 0 };
    }
    monthlyData[monthKey].revenue += sale.amount;
    monthlyData[monthKey].count += 1;
  });
  
  return Object.keys(monthlyData).sort().map(month => ({
    month,
    revenue: monthlyData[month].revenue,
    count: monthlyData[month].count
  }));
};

const getRevenueByProduct = () => {
  const db = readDB();
  const productRevenue = {};
  
  db.sales.forEach(sale => {
    productRevenue[sale.product] = (productRevenue[sale.product] || 0) + sale.amount;
  });
  
  return Object.keys(productRevenue).map(product => ({
    product,
    revenue: productRevenue[product]
  }));
};

const getLeadSources = () => {
  const db = readDB();
  const sources = {};
  
  db.leads.forEach(lead => {
    sources[lead.source] = (sources[lead.source] || 0) + 1;
  });
  
  return Object.keys(sources).map(source => ({
    source,
    count: sources[source]
  }));
};

const getConversionFunnel = () => {
  const db = readDB();
  
  return [
    { stage: 'Total Leads', count: db.leads.length },
    { stage: 'Contacted', count: db.leads.filter(l => l.status === 'contacted' || l.status === 'qualified').length },
    { stage: 'Qualified', count: db.leads.filter(l => l.status === 'qualified').length },
    { stage: 'Converted', count: db.sales.filter(s => s.status === 'completed').length }
  ];
};

// EXPORT ALL FUNCTIONS
module.exports = {
  readDB,
  writeDB,
  findUserByEmail,
  findUserById,
  createUser,
  getAllSales,
  createSale,
  getSalesStats,
  getAllLeads,
  createLead,
  getLeadsStats,
  createInsight,
  getAllInsights,
  createAdCopy,
  getAllAdCopies,
  getSalesTrend,
  getRevenueByProduct,
  getLeadSources,
  getConversionFunnel
};
