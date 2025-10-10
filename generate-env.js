const fs = require("fs");
const path = require("path");

// Helper to load key from process.env, or from a local .env file if present
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  return content.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return acc;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    acc[key] = val;
    return acc;
  }, {});
}

const rootEnv = loadEnvFile(path.join(__dirname, '.env'));

function get(key) {
  return process.env[key] || rootEnv[key] || '';
}

const envContent = `window.env = {
  VITE_FIREBASE_API_KEY: "${get('VITE_FIREBASE_API_KEY')}",
  VITE_FIREBASE_AUTH_DOMAIN: "${get('VITE_FIREBASE_AUTH_DOMAIN')}",
  VITE_FIREBASE_PROJECT_ID: "${get('VITE_FIREBASE_PROJECT_ID')}",
  VITE_FIREBASE_STORAGE_BUCKET: "${get('VITE_FIREBASE_STORAGE_BUCKET')}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${get('VITE_FIREBASE_MESSAGING_SENDER_ID')}",
  VITE_FIREBASE_APP_ID: "${get('VITE_FIREBASE_APP_ID')}",
  VITE_FIREBASE_MEASUREMENT_ID: "${get('VITE_FIREBASE_MEASUREMENT_ID')}"
};
`;

fs.writeFileSync(path.join(__dirname, 'scripts', 'env.js'), envContent.trim());
console.log("✅ scripts/env.js file generated successfully!");
// 