// Global test setup - runs before all tests

// Create mock datastore for tests
const mockDatastore = {
  getProducts: jest.fn(() => []),
  getProperties: jest.fn(() => []),
  getOperators: jest.fn(() => []),
  products: [],
  properties: [],
  operators: [],
};

// Add mock datastore to window object
Object.defineProperty(window, "datastore", {
  value: mockDatastore,
  writable: true,
});

// Make mock available to tests that need it
Object.assign(global, { mockDatastore });

export {};
