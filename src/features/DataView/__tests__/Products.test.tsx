import { render, screen } from "@testing-library/react";
import Products from "../index";

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
      screen.getByRole("table", { name: "Near earth comets data table" }),
    ).toBeInTheDocument();

    // Component should render column headers for our mock properties
    expect(
      screen.getByRole("columnheader", { name: "Color" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Size" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Price" }),
    ).toBeInTheDocument();
  });

  it("renders product data", () => {
    render(<Products />);

    // Component should render the mock product data
    expect(screen.getByText("red")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("large")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("29.99")).toBeInTheDocument();
    expect(screen.getByText("19.99")).toBeInTheDocument();
  });

  it("renders with correct grid layout", () => {
    render(<Products />);

    const table = screen.getByRole("table");
    // With 3 properties, grid should be 3 columns
    expect(table).toHaveStyle(
      "grid-template-columns: repeat(3, minmax(100px, 1fr))",
    );
  });
});
