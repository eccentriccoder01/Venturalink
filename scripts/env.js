// scripts/env.js
// Load environment variables from server and expose them to window object
// This allows browser-side code to access server environment variables

(async function loadEnv() {
  try {
    // Fetch Firebase configuration from server API
    const response = await fetch('/api/config');
    
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
    }
    
    const config = await response.json();
    
    // Expose Firebase config to window object
    window.firebaseConfig = config.firebaseConfig;
    
    console.log('✅ Environment configuration loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load environment configuration:', error.message);
    console.warn('⚠️ Firebase may not initialize correctly without proper configuration');
  }
})();
