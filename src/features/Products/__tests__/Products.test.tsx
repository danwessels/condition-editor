import { render, screen } from "@testing-library/react";
import Products from "../index";
import type { Property, Product } from "../../../types";

// Mock the datastore
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

const mockDatastore = {
  getProperties: jest.fn(() => mockProperties),
  getProducts: jest.fn(() => mockProducts),
  getOperators: jest.fn(() => []),
};

// Mock window.datastore
Object.defineProperty(window, "datastore", {
  value: mockDatastore,
  writable: true,
});

// Mock utils functions
jest.mock("../utils", () => ({
  getOperatorOptions: jest.fn(() => []),
  getValueOptions: jest.fn(() => []),
  getPropertiesOptions: jest.fn(() =>
    mockProperties.map((p) => ({ value: p.id.toString(), label: p.name })),
  ),
  getSelectedProperty: jest.fn(() => null),
  getFilteredProducts: jest.fn(() => mockProducts),
}));

describe("Products Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product filters", () => {
    render(<Products />);

    expect(screen.getByText("Select a property")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });

  it("renders product table structure", () => {
    render(<Products />);

    // Check if the table role is present
    expect(
      screen.getByRole("table", { name: "Product data table" }),
    ).toBeInTheDocument();

    // Since component starts with empty properties, no column headers will be shown initially
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("renders empty state initially", () => {
    render(<Products />);

    // Since component starts with empty properties and products, no product data will be shown
    expect(screen.queryByText("red")).not.toBeInTheDocument();
    expect(screen.queryByText("blue")).not.toBeInTheDocument();
    expect(screen.queryByText("large")).not.toBeInTheDocument();
    expect(screen.queryByText("medium")).not.toBeInTheDocument();
    expect(screen.queryByText("29.99")).not.toBeInTheDocument();
    expect(screen.queryByText("19.99")).not.toBeInTheDocument();
  });

  it("has proper accessibility structure", () => {
    render(<Products />);

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Product data table");

    // Since the component starts with empty properties, we shouldn't expect column headers
    expect(table).toBeInTheDocument();
  });

  it("renders with empty state initially", () => {
    render(<Products />);

    const table = screen.getByRole("table");
    // With empty properties array, grid should be 0 columns
    expect(table).toHaveStyle(
      "grid-template-columns: repeat(0, minmax(100px, 1fr))",
    );
  });
});
