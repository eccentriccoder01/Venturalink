const fs = require("fs");

const envContent = `
window.env = {
  VITE_FIREBASE_API_KEY: "${process.env.VITE_FIREBASE_API_KEY}",
  VITE_FIREBASE_AUTH_DOMAIN: "${process.env.VITE_FIREBASE_AUTH_DOMAIN}",
  VITE_FIREBASE_PROJECT_ID: "${process.env.VITE_FIREBASE_PROJECT_ID}",
  VITE_FIREBASE_STORAGE_BUCKET: "${process.env.VITE_FIREBASE_STORAGE_BUCKET}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
  VITE_FIREBASE_APP_ID: "${process.env.VITE_FIREBASE_APP_ID}",
  VITE_FIREBASE_MEASUREMENT_ID: "${process.env.VITE_FIREBASE_MEASUREMENT_ID}"
};
`;

fs.writeFileSync("scripts/env.js", envContent.trim());
console.log("✅ env.js file generated successfully!");
