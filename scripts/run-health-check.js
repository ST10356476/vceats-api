const request = require('supertest');
const { app } = require('../src/server');

async function run() {
  try {
    const res = await request(app).get('/api/health');
    // Print only a minimal confirmation to avoid leaking any response content in logs
    console.log(`Health check status: ${res.status}`);
    process.exit(0);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('Health check error', err.message || err);
    process.exit(1);
  }
}

run();
