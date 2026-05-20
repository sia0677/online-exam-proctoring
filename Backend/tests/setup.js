// Setup file for Jest before running tests
// E.g., setting up in-memory MongoDB, global variables, etc.

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = 5001;

beforeAll(async () => {
  // Mock DB connection if needed
});

afterAll(async () => {
  // Teardown DB connection
});
