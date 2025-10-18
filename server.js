
require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static(__dirname));

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://venturalink.vercel.app",
      "https://venturalink-git-master-krishagandhi0711.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "register.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "about.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));
app.get("/features", (req, res) => res.sendFile(path.join(__dirname, "features.html")));
app.get("/pricing", (req, res) => res.sendFile(path.join(__dirname, "pricing.html")));

// ✅ Chatbot API Routes
app.get("/api/chat/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    chatbot: model ? "enabled" : "disabled",
    message: "Venturalink Chatbot API is running!" 
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!model) {
      return res.status(503).json({ 
        error: "Chatbot service unavailable. API key not configured." 
      });
    }

    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required and must be a non-empty string" });
    }

    const contextualPrompt = `You are Venturalink's AI assistant. Venturalink is a platform that connects entrepreneurs, investors, and advisors for startup ecosystem collaboration. 

User question: ${message}

Please provide a helpful response related to entrepreneurship, startup funding, business development, or general business advice. If the question is not business-related, still try to be helpful while gently steering toward business topics when appropriate.`;

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
    res.status(500).json({ 
      error: "Internal Server Error",
      message: "Failed to process your request. Please try again later."
    });
  }
});

app.use((req, res) => res.status(404).send("Page not found"));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Venturalink server running at http://localhost:${PORT}`);
    console.log(`🤖 Chatbot API available at http://localhost:${PORT}/api/chat`);
  });
} else {

  module.exports = app;
}
