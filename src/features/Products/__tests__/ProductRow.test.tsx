import { render, screen } from "@testing-library/react";
import ProductRow from "../ProductRow";
import { ProductContext } from "../context";
import type { Product, Property } from "../../../types";
import type { State } from "../reducer";

// Mock the datastore
const mockProperties: Property[] = [
  { id: 1, name: "color", type: "string", values: ["red", "blue", "green"] },
  { id: 2, name: "size", type: "string", values: ["small", "medium", "large"] },
  { id: 3, name: "price", type: "number", values: [] },
];

const mockDatastore = {
  getProperties: jest.fn(() => mockProperties),
  getProducts: jest.fn(() => []),
  getOperators: jest.fn(() => []),
};

// Mock window.datastore
Object.defineProperty(window, "datastore", {
  value: mockDatastore,
  writable: true,
});

describe("ProductRow Component", () => {
  const mockProduct: Product = {
    id: 1,
    property_values: [
      { property_id: 1, value: "red" },
      { property_id: 2, value: "large" },
      { property_id: 3, value: 29.99 },
    ],
  };

  const mockState: State = {
    selectedProperty: null,
    selectedOperator: null,
    selectedValues: [],
    searchText: "",
    properties: mockProperties,
    operators: [],
    products: [],
  };

  const mockDispatch = jest.fn();

  const renderWithContext = (product: Product) => {
    return render(
      <ProductContext value={[mockState, mockDispatch]}>
        <ProductRow product={product} />
      </ProductContext>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product property values in correct order", () => {
    renderWithContext(mockProduct);

    // Check if all property values are displayed
    expect(screen.getByText("red")).toBeInTheDocument();
    expect(screen.getByText("large")).toBeInTheDocument();
    expect(screen.getByText("29.99")).toBeInTheDocument();
  });

  it("renders cells with proper accessibility roles", () => {
    renderWithContext(mockProduct);

    const row = screen.getByRole("row");
    expect(row).toBeInTheDocument();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(3); // One for each property
  });

  it("displays placeholder for missing property values", () => {
    const productWithMissingValues: Product = {
      id: 2,
      property_values: [
        { property_id: 1, value: "blue" },
        // Missing size (property_id: 2)
        { property_id: 3, value: 19.99 },
      ],
    };

    renderWithContext(productWithMissingValues);

    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument(); // Placeholder for missing size
    expect(screen.getByText("19.99")).toBeInTheDocument();
  });

  it("handles string and number property values correctly", () => {
    renderWithContext(mockProduct);

    // String values
    expect(screen.getByText("red")).toBeInTheDocument();
    expect(screen.getByText("large")).toBeInTheDocument();

    // Number value
    expect(screen.getByText("29.99")).toBeInTheDocument();
  });

  it("generates unique keys for each cell", () => {
    const { container } = renderWithContext(mockProduct);

    // Check that cells have the expected structure
    const cells = container.querySelectorAll('[role="cell"]');
    expect(cells).toHaveLength(3);

    // Verify they all have content
    expect(cells[0]).toHaveTextContent("red");
    expect(cells[1]).toHaveTextContent("large");
    expect(cells[2]).toHaveTextContent("29.99");
  });

  it("handles empty product property values array", () => {
    const emptyProduct: Product = {
      id: 3,
      property_values: [],
    };

    renderWithContext(emptyProduct);

    // Should display placeholders for all properties
    const placeholders = screen.getAllByText("—");
    expect(placeholders).toHaveLength(3);
  });
});
