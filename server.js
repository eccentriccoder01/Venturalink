
require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// ===== SECURITY MIDDLEWARE =====

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'", 
        "https://firestore.googleapis.com", 
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://www.googleapis.com",
        "https://www.gstatic.com"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for chatbot
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 chat requests per windowMs
  message: {
    error: "Too many chat requests, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== BASIC MIDDLEWARE =====

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://venturalink.vercel.app",
      "https://venturalink-git-master-krishagandhi0711.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// ===== GOOGLE GEMINI AI INITIALIZATION =====

let genAI, model;
try {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("⚠️ API_KEY not found in environment variables. Chatbot will be disabled.");
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("✅ Google Gemini AI initialized successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize Google Gemini AI:", error.message);
}

// ===== ROUTES =====

// Static page routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "register.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "about.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));
app.get("/features", (req, res) => res.sendFile(path.join(__dirname, "features.html")));
app.get("/pricing", (req, res) => res.sendFile(path.join(__dirname, "pricing.html")));

// ===== API ROUTES =====

// Health check endpoint
app.get("/api/chat/health", apiLimiter, (req, res) => {
  res.json({ 
    status: "healthy", 
    chatbot: model ? "enabled" : "disabled",
    message: "Venturalink Chatbot API is running!",
    timestamp: new Date().toISOString()
  });
});

// Config endpoint - serves Firebase configuration to client
app.get("/api/config", apiLimiter, (req, res) => {
  try {
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    // Validate that all required Firebase keys are present
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

    if (missingKeys.length > 0) {
      console.warn(`⚠️ Firebase Configuration Warning: Missing keys: ${missingKeys.join(', ')}`);
      return res.status(400).json({
        error: 'Incomplete Firebase configuration',
        missingKeys: missingKeys,
        message: 'Please check your .env file and ensure all required Firebase variables are set'
      });
    }

    res.json({ 
      firebaseConfig: firebaseConfig,
      message: 'Firebase configuration loaded successfully'
    });
  } catch (error) {
    console.error('❌ Error serving Firebase configuration:', error.message);
    res.status(500).json({ 
      error: 'Failed to load configuration',
      message: error.message 
    });
  }
});

// Chatbot endpoint with validation and rate limiting
app.post(
  "/api/chat",
  chatLimiter,
  [
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
      .escape() // Sanitize HTML/special characters
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      // Check if chatbot is available
      if (!model) {
        return res.status(503).json({ 
          error: "Chatbot service unavailable",
          message: "API key not configured. Please contact support."
        });
      }

      const { message } = req.body;

      // Create contextual prompt
      const contextualPrompt = `You are Venturalink's AI assistant. Venturalink is a platform that connects entrepreneurs, investors, and advisors for startup ecosystem collaboration. 

User question: ${message}

Please provide a helpful response related to entrepreneurship, startup funding, business development, or general business advice. If the question is not business-related, still try to be helpful while gently steering toward business topics when appropriate.`;

      // Generate AI response
      const result = await model.generateContent(contextualPrompt);

      const reply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "I couldn't generate a response at the moment. Please try again.";

      res.json({ 
        reply,
        timestamp: new Date().toISOString(),
        model: "gemini-2.0-flash"
      });

    } catch (error) {
      console.error("❌ Chatbot Error:", error);
      
      // Don't expose internal error details in production
      const errorMessage = process.env.NODE_ENV === 'production' 
        ? "Failed to process your request. Please try again later."
        : error.message;

      res.status(500).json({ 
        error: "Internal Server Error",
        message: errorMessage
      });
    }
  }
);

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' 
      ? "Something went wrong" 
      : err.message
  });
});

// ===== SERVER STARTUP =====

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Venturalink server running at http://localhost:${PORT}`);
    console.log(`🤖 Chatbot API available at http://localhost:${PORT}/api/chat`);
    console.log(`🔒 Security headers enabled`);
    console.log(`⏱️  Rate limiting active`);
  });
} else {
  // Export for serverless deployment (Vercel)
  module.exports = app;
}
