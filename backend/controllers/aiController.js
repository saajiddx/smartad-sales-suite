const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createInsight, getAllInsights, createAdCopy, getAllAdCopies, getAllSales } = require('../models/database');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate AI sales insights using Gemini
// @route   POST /api/ai/insights
// @access  Private
const generateInsights = async (req, res, next) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const salesData = {
      totalSales: getAllSales().length,
      totalRevenue: getAllSales().reduce((sum, s) => sum + s.amount, 0),
      recentSales: getAllSales().slice(-5)
    };
    
    // Use Gemini AI if configured, otherwise fallback to mock
    let insight = '';
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-key-here') {
      try {
        // Get Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        const prompt = `You are an expert business consultant and sales strategist with deep knowledge of sales optimization, revenue growth, and business development. Provide actionable, specific, and practical advice. Be professional but approachable. Use data-driven insights when possible.

Sales Question: ${question}

Current Sales Context:
- Total Sales: ${salesData.totalSales}
- Total Revenue: $${salesData.totalRevenue}
- Recent Activity: ${JSON.stringify(salesData.recentSales, null, 2)}

Provide detailed, actionable business advice with specific recommendations. Format your response in markdown with clear sections and bullet points.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        insight = response.text();
      } catch (aiError) {
        console.error('Gemini AI Error:', aiError);
        // Fallback to mock if AI fails
        insight = `# Business Strategy Recommendations\n\nBased on your ${salesData.totalSales} sales totaling $${salesData.totalRevenue.toLocaleString()}, focus on: revenue optimization, customer retention, and data-driven decision making for 30-50% growth potential.`;
      }
    } else {
      // Mock response if no API key
      insight = `# Business Strategy Recommendations\n\nBased on your ${salesData.totalSales} sales totaling $${salesData.totalRevenue.toLocaleString()}, focus on: revenue optimization, customer retention, and data-driven decision making for 30-50% growth potential.`;
    }
    
    // Save insight to database
    const savedInsight = createInsight({
      userId: req.user.id,
      question,
      insight
    });
    
    res.json({ success: true, insight, saved: savedInsight, isAI: !!process.env.GEMINI_API_KEY });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI ad copy using Gemini
// @route   POST /api/ai/adcopy
// @access  Private
const generateAdCopy = async (req, res, next) => {
  try {
    const { platform, productName, description } = req.body;
    
    if (!platform || !productName || !description) {
      return res.status(400).json({ error: 'Platform, product name, and description are required' });
    }
    
    let adCopy = '';
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-key-here') {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        const platformGuidelines = {
          'facebook': 'Engaging, conversational, emoji-friendly. Primary text max 125 characters. Focus on emotional connection and social proof. Include: Headline (40 chars), Primary Text (125 chars), Description, Call-to-Action, Visual suggestions',
          'instagram': 'Visual storytelling, aesthetic language, hashtag-ready, inspirational. Max 125 characters for primary text. Include: Caption with emojis, Hashtags (5-10 relevant), Strong CTA, Visual strategy suggestions',
          'google': 'Concise, keyword-rich, benefit-focused. Headline max 30 chars each, Description max 90 chars. Include: Headlines (3x 30 chars), Descriptions (2x 90 chars), Sitelinks, Extensions, Keywords'
        };
        
        const platformInfo = platformGuidelines[platform] || platformGuidelines['facebook'];
        
        const prompt = `You are an expert marketing copywriter specializing in ${platform} advertising. Create compelling, conversion-focused ad copy that follows platform best practices.

Platform: ${platform}
Guidelines: ${platformInfo}

Product Name: ${productName}
Product Description: ${description}

Generate professional ad copy with proper structure. Format clearly with sections for each component (Headlines, Body/Primary Text, CTA, Hashtags if applicable, Visual suggestions, and platform-specific elements). Make it ready to use immediately.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        adCopy = response.text();
      } catch (aiError) {
        console.error('Gemini AI Error:', aiError);
        // Fallback to mock
        adCopy = `📘 ${platform.toUpperCase()} AD COPY\n\n🎯 HEADLINE\n${productName} - Transform Your Business\n\n✨ BODY\n${description.substring(0, 100)}...\n\n👉 CTA: Learn More`;
      }
    } else {
      // Mock ad copy
      adCopy = `📘 ${platform.toUpperCase()} AD COPY\n\n🎯 HEADLINE\n${productName} - Transform Your Business\n\n✨ BODY\n${description.substring(0, 100)}...\n\n👉 CTA: Learn More`;
    }
    
    // Save ad copy to database
    const savedAdCopy = createAdCopy({
      userId: req.user.id,
      platform,
      productName,
      description,
      adCopy
    });
    
    const platformNames = {
      'facebook': 'Facebook Ads',
      'instagram': 'Instagram Ads',
      'google': 'Google Ads'
    };
    
    res.json({ success: true, adCopy, platform: platformNames[platform], saved: savedAdCopy, isAI: !!process.env.GEMINI_API_KEY });
  } catch (error) {
    next(error);
  }
};

// @desc    Get insights history
// @route   GET /api/ai/insights
// @access  Private
const getInsights = async (req, res, next) => {
  try {
    const insights = getAllInsights().filter(i => i.userId === req.user.id);
    res.json({ success: true, insights });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ad copies history
// @route   GET /api/ai/adcopies
// @access  Private
const getAdCopies = async (req, res, next) => {
  try {
    const adCopies = getAllAdCopies().filter(a => a.userId === req.user.id);
    res.json({ success: true, adCopies });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInsights,
  generateAdCopy,
  getInsights,
  getAdCopies
};