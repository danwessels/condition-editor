import "@testing-library/jest-dom";
import type { Property, Product, Operator } from "./types";

// Global test setup - runs before all tests

// Shared mock data for all tests
const mockProperties: Property[] = [
  { id: 1, name: "color", type: "string", values: ["red", "blue", "green"] },
  { id: 2, name: "size", type: "string", values: ["small", "medium", "large"] },
  { id: 3, name: "price", type: "number", values: [] },
];

const mockProducts: Product[] = [
  {
    id: 1,
    property_values: [
      { property_id: 1, value: "red" },
      { property_id: 2, value: "large" },
      { property_id: 3, value: 29.99 },
    ],
  },
  {
    id: 2,
    property_values: [
      { property_id: 1, value: "blue" },
      { property_id: 2, value: "medium" },
      { property_id: 3, value: 19.99 },
    ],
  },
];

const mockOperators: Operator[] = [
  { id: "equals", text: "Equals" },
  { id: "contains", text: "Contains" },
  { id: "in", text: "In" },
  { id: "greater_than", text: "Greater Than" },
  { id: "less_than", text: "Less Than" },
  { id: "any", text: "Any" },
  { id: "none", text: "None" },
];

// Create mock datastore with real test data
const mockDatastore = {
  getProducts: jest.fn(() => mockProducts),
  getProperties: jest.fn(() => mockProperties),
  getOperators: jest.fn(() => mockOperators),
  products: mockProducts,
  properties: mockProperties,
  operators: mockOperators,
};

// Add mock datastore to window object
Object.defineProperty(window, "datastore", {
  value: mockDatastore,
  writable: true,
});

// Make mock available to tests that need it
Object.assign(global, {
  mockDatastore,
  mockProperties,
  mockProducts,
  mockOperators,
});

export {};
