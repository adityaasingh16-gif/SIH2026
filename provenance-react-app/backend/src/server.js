/**
 * ============================================================================
 * SERVER ENTRY POINT
 * ============================================================================
 * Connects to MongoDB, then starts the Express app defined in app.js.
 * app.js is kept as a pure Express app (no side effects) so it can also be
 * imported directly in tests without opening a real port or DB connection.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://adityasingh16007:DRYJJooOOhVpYq3o@cluster0.agahjjc.mongodb.net/';

function start() {
  // Start the HTTP server immediately — don't block the API (and the
  // frontend's health check) on the database being reachable. Routes that
  // touch MongoDB will simply fail until the connection below succeeds.
  app.listen(PORT, () => {
    console.log('\n==================================================');
    console.log(`🚀  Government eVault API running on http://localhost:${PORT}`);
    console.log(`🔒  BSA 2023 §63 compliance layer active`);
    console.log('==================================================\n');
  });

  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('✅  MongoDB connected:', MONGO_URI))
    .catch((err) => {
      console.error('❌  MongoDB connection failed:', err.message);
      console.error('    The API is running, but any route touching the');
      console.error('    database will fail until MongoDB is reachable.');
      console.error('    Set MONGO_URI in backend/.env to point at your instance,');
      console.error('    or run a local MongoDB (e.g. `docker run -p 27017:27017 mongo`).');
    });
}

start();
