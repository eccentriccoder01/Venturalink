# Venturalink Chatbot Setup Guide

## 🤖 Overview

The Venturalink chatbot is an AI-powered assistant built with Google Gemini AI that helps users with startup-related questions, business advice, and general entrepreneurship guidance.

## 🚀 Features

- **AI-Powered Responses**: Uses Google Gemini 2.0 Flash model for intelligent responses
- **Contextual Awareness**: Tailored specifically for startup and business topics
- **Modern UI**: Beautiful, responsive chat interface
- **Real-time Communication**: Instant responses with typing indicators
- **Mobile Responsive**: Works perfectly on all devices
- **Easy Integration**: Simple to add to any page

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **Google Gemini API Key** - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Vercel Account** (for deployment)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file and add your Google Gemini API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   PORT=8080
   NODE_ENV=development
   ```

### 3. Local Development

```bash
npm start
```

The server will start at `http://localhost:8080`

### 4. Test the Chatbot

1. Open your browser and go to `http://localhost:8080`
2. Look for the chat icon in the bottom-right corner
3. Click it to open the chatbot
4. Try asking questions like:
   - "How do I pitch my startup to investors?"
   - "What should I include in my business plan?"
   - "How can I find co-founders?"

## 🌐 Deployment on Vercel

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Set Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `API_KEY` with your Google Gemini API key
4. Add `NODE_ENV` with value `production`

### 3. Redeploy

```bash
vercel --prod
```

## 📁 File Structure

```
Venturalink/
├── server.js                 # Main server with chatbot API
├── scripts/
│   └── chatbot.js           # Frontend chatbot component
├── styles/
│   └── chatbot.css          # Chatbot styling
├── env.example              # Environment variables template
├── vercel.json              # Vercel deployment config
└── CHATBOT_SETUP.md         # This guide
```

## 🔧 API Endpoints

### Health Check
```
GET /api/chat/health
```
Returns chatbot status and availability.

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "reply": "AI response here",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "model": "gemini-2.0-flash"
}
```

## 🎨 Customization

### Styling
Edit `styles/chatbot.css` to customize:
- Colors and gradients
- Chat bubble appearance
- Animation effects
- Mobile responsiveness

### Behavior
Edit `scripts/chatbot.js` to modify:
- Welcome messages
- Response handling
- UI interactions
- Error messages

### AI Context
Edit the `contextualPrompt` in `server.js` to change:
- Bot personality
- Response focus areas
- Business context

## 🔍 Troubleshooting

### Common Issues

1. **"API key is missing" error**
   - Ensure your `.env` file exists and contains `API_KEY`
   - Check that the API key is valid and active

2. **"Chatbot service unavailable" error**
   - Verify your Google Gemini API key is correct
   - Check your internet connection
   - Ensure you have API quota remaining

3. **CORS errors**
   - Update the CORS origins in `server.js` to include your domain
   - Check that your frontend is making requests to the correct API endpoint

4. **Chatbot not appearing**
   - Ensure `chatbot.css` and `chatbot.js` are properly linked
   - Check browser console for JavaScript errors
   - Verify the chatbot container is being created

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
DEBUG=true
```

## 📊 Monitoring

### Health Check
Monitor chatbot availability:
```bash
curl https://your-domain.vercel.app/api/chat/health
```

### Logs
Check Vercel function logs for errors and usage patterns.

## 🔒 Security

- API keys are stored securely in environment variables
- CORS is configured to restrict origins
- Input validation prevents malicious requests
- Rate limiting can be added for production use

## 🚀 Advanced Features

### Future Enhancements
- Conversation history persistence
- User authentication integration
- Multi-language support
- File upload capabilities
- Integration with Venturalink user profiles

### Performance Optimization
- Response caching
- Connection pooling
- CDN integration
- Image optimization

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify API key and environment setup

## 📝 License

This chatbot implementation is part of the Venturalink project and follows the same license terms.

---

**Happy Chatting! 🤖✨**
