import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductContext } from "../context";
import ProductFilters from "../ProductFilters";
import type { State } from "../reducer";
import type { Property, Operator } from "../../../types";

// Get global mock data from setupTests
declare const mockProperties: Property[];
declare const mockOperators: Operator[];

describe("ProductFilters Component", () => {
  const initialState: State = {
    selectedProperty: null,
    selectedOperator: null,
    selectedValues: [],
    searchText: "",
    properties: mockProperties,
    operators: mockOperators,
    products: [],
  };

  const mockDispatch = jest.fn();

  const renderWithContext = (state = initialState) => {
    return render(
      <ProductContext value={[state, mockDispatch]}>
        <ProductFilters />
      </ProductContext>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders property select with placeholder", () => {
    renderWithContext();

    expect(screen.getByText("Select a property")).toBeInTheDocument();
  });

  it("shows operator select after property is selected", () => {
    const stateWithProperty: State = {
      ...initialState,
      selectedProperty: { value: "1", label: "color" },
    };

    renderWithContext(stateWithProperty);

    expect(screen.getByText("Select an operator")).toBeInTheDocument();
  });

  it("shows appropriate input types based on selection", () => {
    // Test text input for text operators
    const stateWithTextOperator: State = {
      ...initialState,
      selectedProperty: { value: "1", label: "color" },
      selectedOperator: { value: "contains", label: "Contains" },
    };

    const { unmount } = renderWithContext(stateWithTextOperator);

    const textInput = screen.getByPlaceholderText("Enter value");
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveAttribute("type", "text");

    unmount();

    // Test number input for number properties
    const stateWithNumberProperty: State = {
      ...initialState,
      selectedProperty: { value: "3", label: "price" },
      selectedOperator: { value: "equals", label: "Equals" },
    };

    renderWithContext(stateWithNumberProperty);

    const numberInput = screen.getByPlaceholderText("Enter value");
    expect(numberInput).toHaveAttribute("type", "number");
  });

  it('shows multi-select for "in" operator', () => {
    const stateWithInOperator: State = {
      ...initialState,
      selectedProperty: { value: "1", label: "color" },
      selectedOperator: { value: "in", label: "In" },
    };

    renderWithContext(stateWithInOperator);

    expect(screen.getByText("Select one or more values")).toBeInTheDocument();
  });

  it("dispatches clear_all action when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderWithContext();

    const clearButton = screen.getByRole("button", { name: "Clear filters" });
    await user.click(clearButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "clear_all",
    });
  });

  it("hides input for operators that do not need values", () => {
    const stateWithAnyOperator: State = {
      ...initialState,
      selectedProperty: { value: "1", label: "color" },
      selectedOperator: { value: "any", label: "Any" },
    };

    renderWithContext(stateWithAnyOperator);

    expect(
      screen.queryByPlaceholderText("Enter value"),
    ).not.toBeInTheDocument();
  });

  it("displays current search text in input", () => {
    const stateWithSearchText: State = {
      ...initialState,
      selectedProperty: { value: "1", label: "color" },
      selectedOperator: { value: "contains", label: "Contains" },
      searchText: "red",
    };

    renderWithContext(stateWithSearchText);

    const textInput = screen.getByDisplayValue("red");
    expect(textInput).toBeInTheDocument();
  });
});
