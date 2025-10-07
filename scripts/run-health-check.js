const request = require('supertest');
const { app } = require('../src/server');

async function run() {
  try {
    const res = await request(app).get('/api/health');
    console.log('STATUS', res.status);
    console.log('BODY', res.body);
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
}

run();
