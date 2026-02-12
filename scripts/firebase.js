// Re-export Firebase services from firebase-config.js
// This prevents duplicate initialization and maintains backward compatibility
import { auth, db, app } from './firebase-config.js';

export { auth, db, app };