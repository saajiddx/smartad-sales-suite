const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');
const leadsRoutes = require('./routes/leads');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SmartAd Sales Suite API is running',
    version: '2.0.0',
    auth: 'JWT (Professional)'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚀 SmartAd Sales Suite                     ║
  ║      Smart Sales & Marketing Automation      ║
  ║                                               ║
  ║   📍 URL: http://localhost:${PORT}            ║
  ║   🔧 Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║   🔐 Auth: JWT (Secure)                       ║
  ║   ✅ Status: Ready                            ║
  ╚═══════════════════════════════════════════════╝
  
  👉 Open your browser to http://localhost:${PORT}
  🔑 Create a new account to get started!
  
  📚 Features:
  - Sales & Lead Management
  - AI Sales Insights
  - AI Ad Copy Generator (AdGen Pro)
  - Advanced Analytics
  - Secure JWT Authentication
  `);
});