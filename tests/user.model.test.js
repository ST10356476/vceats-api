const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // clear collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

test('User model hashes password and omits it from toJSON', async () => {
  const User = require('../src/models/User');

  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  // password should not be returned by default
  const found = await User.findOne({ email: 'test@example.com' }).select('+password');
  expect(found).toBeTruthy();
  expect(found.password).toBeDefined();
  expect(found.password).not.toBe('password123');

  const json = found.toJSON();
  expect(json.password).toBeUndefined();
  expect(json.email).toBe('test@example.com');
});
