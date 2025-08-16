import reducer, { type State, type Action } from "../reducer";
import type { SelectOptionType } from "../../../types";
import type { OperatorOptionType } from "../reducer";
import type { Product, Property, Operator } from "../../../types";

// Get global mock data from setupTests
declare const mockOperators: Operator[];
declare const mockProperties: Property[];
declare const mockProducts: Product[];

describe("products state reducer", () => {
  const initialState: State = {
    selectedProperty: null,
    selectedOperator: null,
    selectedValues: [],
    searchText: "",
    properties: mockProperties,
    operators: mockOperators,
    products: mockProducts,
    page: 1,
  };

  describe("update_property action", () => {
    it("should update selectedProperty and reset dependent fields", () => {
      const property: SelectOptionType = { value: "1", label: "Color" };
      const action: Action = {
        type: "update_property",
        value: property,
      };

      const previousState: State = {
        ...initialState,
        selectedProperty: { value: "2", label: "Size" },
        selectedOperator: { value: "equals", label: "Equals" },
        selectedValues: [{ value: "red", label: "Red" }],
        searchText: "test",
      };

      const newState = reducer(previousState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: property,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
      });
    });

    it("should handle null property value", () => {
      const action: Action = {
        type: "update_property",
        value: null,
      };

      const newState = reducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: null,
        selectedOperator: null,
        searchText: "",
      });
    });
  });

  describe("update_operator action", () => {
    it("should update selectedOperator and reset dependent fields", () => {
      const operator: OperatorOptionType = {
        value: "contains",
        label: "Contains",
      };
      const action: Action = {
        type: "update_operator",
        value: operator,
      };

      const previousState: State = {
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "equals", label: "Equals" },
        selectedValues: [{ value: "red", label: "Red" }],
        searchText: "test",
      };

      const newState = reducer(previousState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: operator,
        selectedValues: [],
        searchText: "",
      });
    });

    it("should handle null operator value", () => {
      const action: Action = {
        type: "update_operator",
        value: null,
      };

      const newState = reducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: null,
        selectedOperator: null,
        searchText: "",
      });
    });
  });

  describe("update_values action", () => {
    it("should update selectedValues without affecting other fields", () => {
      const values: SelectOptionType[] = [
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
      ];
      const action: Action = {
        type: "update_values",
        value: values,
      };

      const previousState: State = {
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "in", label: "In" },
        searchText: "test",
      };

      const newState = reducer(previousState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "in", label: "In" },
        selectedValues: values,
        searchText: "test",
      });
    });

    it("should handle empty values array", () => {
      const action: Action = {
        type: "update_values",
        value: [],
      };

      const newState = reducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedValues: [],
      });
    });
  });

  describe("update_search_text action", () => {
    it("should update searchText without affecting other fields", () => {
      const searchText = "new search text";
      const action: Action = {
        type: "update_search_text",
        value: searchText,
      };

      const previousState: State = {
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "contains", label: "Contains" },
        selectedValues: [{ value: "red", label: "Red" }],
        searchText: "old text",
      };

      const newState = reducer(previousState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "contains", label: "Contains" },
        selectedValues: [{ value: "red", label: "Red" }],
        searchText: searchText,
      });
    });

    it("should handle empty search text", () => {
      const action: Action = {
        type: "update_search_text",
        value: "",
      };

      const newState = reducer(initialState, action);

      expect(newState).toEqual({
        ...initialState,
        searchText: "",
      });
    });
  });

  describe("clear_all action", () => {
    it("should reset all fields to initial state", () => {
      const action: Action = {
        type: "clear_all",
      };

      const previousState: State = {
        ...initialState,
        selectedProperty: { value: "1", label: "Color" },
        selectedOperator: { value: "equals", label: "Equals" },
        selectedValues: [{ value: "red", label: "Red" }],
        searchText: "some text",
      };

      const newState = reducer(previousState, action);

      expect(newState).toEqual({
        ...initialState,
        selectedProperty: null,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
      });
    });

    it("should work when state is already at initial values", () => {
      const action: Action = {
        type: "clear_all",
      };

      const newState = reducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe("default case", () => {
    it("should return current state for unknown action type", () => {
      const unknownAction = { type: "unknown_action" } as Action & {
        type: "unknown_action";
      };
      const newState = reducer(initialState, unknownAction);

      expect(newState).toBe(initialState);
    });
  });
});
