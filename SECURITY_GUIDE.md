# Security Implementation Guide

This document outlines the security measures implemented in Venturalink and provides guidance for maintaining security best practices.

## 🔒 Security Features Implemented

### 1. Helmet Security Headers

Helmet provides protection against common web vulnerabilities by setting HTTP headers:

- **Content-Security-Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-XSS-Protection**: Additional XSS protection layer

### 2. Rate Limiting

Protection against abuse and DoS attacks:

- **General API**: 100 requests per 15 minutes per IP
- **Chatbot API**: 20 requests per 15 minutes per IP
- Automatic retry-after headers
- Configurable limits per endpoint

### 3. Input Validation & Sanitization

Using express-validator for robust input handling:

- Message length validation (1-1000 characters)
- HTML/special character sanitization
- Type checking and format validation
- Comprehensive error messages

### 4. Error Handling

- Global error handler
- Environment-aware error messages (detailed in dev, generic in production)
- Proper HTTP status codes
- Request logging for debugging

## 🚀 Installation

Install security dependencies:

```bash
npm install helmet express-rate-limit express-validator
```

## 📝 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=production

# API Keys (NEVER commit these!)
API_KEY=your_gemini_api_key_here

# Firebase Configuration (Use environment variables!)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Rate Limit Configuration

Adjust rate limits in `server.js` based on your needs:

```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window
  max: 100, // Max requests per window
  message: "Custom error message"
});
```

### CSP Configuration

Modify Content-Security-Policy directives in `server.js`:

```javascript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trusted-cdn.com"],
    // Add more directives as needed
  }
}
```

## 🔐 Security Best Practices

### 1. API Key Management

**❌ NEVER DO THIS:**
```javascript
const apiKey = "AIzaSyA37bruIT_neT5w-8CUuPGofy0Lnv2UJOg"; // Hardcoded!
```

**✅ DO THIS:**
```javascript
const apiKey = process.env.API_KEY; // From environment
```

### 2. Firebase Configuration

**❌ NEVER commit firebase-config.js with real keys!**

**✅ Use environment variables:**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

### 3. Error Handling

**❌ Don't expose internal errors:**
```javascript
res.status(500).json({ error: error.stack }); // Exposes internals!
```

**✅ Use environment-aware messages:**
```javascript
res.status(500).json({ 
  error: process.env.NODE_ENV === 'production' 
    ? "Something went wrong" 
    : error.message 
});
```

### 4. Input Validation

**❌ Trust user input:**
```javascript
const message = req.body.message; // No validation!
```

**✅ Validate and sanitize:**
```javascript
body('message')
  .trim()
  .notEmpty()
  .isLength({ min: 1, max: 1000 })
  .escape()
```

## 🛡️ Security Checklist

Before deploying to production:

- [ ] All API keys moved to environment variables
- [ ] `.env` file added to `.gitignore`
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled and tested
- [ ] HTTPS enforced (HSTS enabled)
- [ ] CSP configured for your domains
- [ ] Error messages don't expose internals
- [ ] Input validation on all endpoints
- [ ] Dependencies updated (`npm audit`)
- [ ] Security headers verified (use securityheaders.com)

## 🔍 Testing Security

### Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..25}; do
  curl -X POST http://localhost:8080/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}' &
done
```

Expected: After 20 requests, you should get a 429 (Too Many Requests) error.

### Test Input Validation

```bash
# Test empty message
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":""}'

# Test too long message
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"'$(python3 -c 'print("a"*1001)')'"}'
```

Expected: Both should return 400 (Bad Request) with validation errors.

### Test Security Headers

```bash
curl -I https://your-domain.com
```

Look for these headers:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Content-Security-Policy`

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please email security@venturalink.com instead of opening a public issue.

## 📄 License

This security implementation follows the same license as the main project.

---

**Last Updated**: January 2026
**Maintained By**: Venturalink Security Team
