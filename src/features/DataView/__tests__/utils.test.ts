import {
  checkMatchesOperatorCondition,
  getOperatorOptions,
  getValueOptions,
  getPropertiesOptions,
  getSelectedProperty,
  getFilteredProducts,
} from "../utils";
import type { State } from "../reducer";
import type {
  OperatorConditionParams,
  Product,
  Property,
  Operator,
} from "../../../types";

// Get global mock data from setupTests
declare const mockDatastore: {
  getOperators: jest.Mock;
  getProperties: jest.Mock;
  getProducts: jest.Mock;
};
declare const mockOperators: Operator[];
declare const mockProperties: Property[];

const initialState: State = {
  selectedProperty: null,
  selectedOperator: null,
  selectedValues: [],
  searchText: "",
  properties: [],
  operators: [],
  products: [],
};

describe("products utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFilteredProducts", () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        property_values: [
          { property_id: 1, value: "Headphones" },
          { property_id: 2, value: "black" },
          { property_id: 3, value: 5 },
        ],
      },
      {
        id: 2,
        property_values: [
          { property_id: 1, value: "Mouse" },
          { property_id: 2, value: "white" },
          { property_id: 3, value: 3 },
        ],
      },
      {
        id: 3,
        property_values: [
          { property_id: 1, value: "Keyboard" },
          { property_id: 2, value: "black" },
          { property_id: 3, value: 4 },
        ],
      },
    ];

    it("should return all products when no filters are applied", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
      };

      const result = getFilteredProducts(state);
      expect(result).toEqual(mockProducts);
    });

    it("should return all products when only property is selected", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "1", label: "Name" },
      };

      const result = getFilteredProducts(state);
      expect(result).toEqual(mockProducts);
    });

    it("should filter products using equals operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "2", label: "Color" },
        selectedOperator: { value: "equals", label: "Equals" },
        searchText: "black",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual([1, 3]);
    });

    it("should filter products using contains operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "1", label: "Name" },
        selectedOperator: { value: "contains", label: "Contains" },
        searchText: "head",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should filter products using greater_than operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "3", label: "Rating" },
        selectedOperator: { value: "greater_than", label: "Greater Than" },
        searchText: "3",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual([1, 3]);
    });

    it("should filter products using less_than operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "3", label: "Rating" },
        selectedOperator: { value: "less_than", label: "Less Than" },
        searchText: "4",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("should filter products using in operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "2", label: "Color" },
        selectedOperator: { value: "in", label: "In" },
        selectedValues: [
          { value: "black", label: "Black" },
          { value: "white", label: "White" },
        ],
        searchText: "",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(3); // All products have either black or white
    });

    it("should filter products using any operator", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "1", label: "Name" },
        selectedOperator: { value: "any", label: "Any" },
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(3); // All products have a name
    });

    it("should handle products with missing property values", () => {
      const productsWithMissing: Product[] = [
        ...mockProducts,
        {
          id: 4,
          property_values: [
            { property_id: 1, value: "Speaker" },
            // Missing property_id 2 and 3
          ],
        },
      ];

      const state: State = {
        ...initialState,
        products: productsWithMissing,
        selectedProperty: { value: "2", label: "Color" },
        selectedOperator: { value: "none", label: "None" },
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it("should return empty array when no products in state", () => {
      const state: State = {
        ...initialState,
        products: [], // Empty products array
        selectedProperty: { value: "1", label: "Name" },
        selectedOperator: { value: "equals", label: "Equals" },
        searchText: "test",
      };

      const result = getFilteredProducts(state);
      expect(result).toEqual([]);
    });

    it("should handle case-insensitive string filtering", () => {
      const state: State = {
        ...initialState,
        products: mockProducts,
        selectedProperty: { value: "1", label: "Name" },
        selectedOperator: { value: "equals", label: "Equals" },
        searchText: "HEADPHONES",
      };

      const result = getFilteredProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("checkMatchesOperatorCondition", () => {
    describe("equals operator", () => {
      it("should return true when values are equal", () => {
        const params: OperatorConditionParams = {
          operator: "equals",
          productValue: "test",
          comparisonValue: "test",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when values are not equal", () => {
        const params: OperatorConditionParams = {
          operator: "equals",
          productValue: "test",
          comparisonValue: "different",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });

      it("should return true when comparison value is empty string", () => {
        const params: OperatorConditionParams = {
          operator: "equals",
          productValue: "test",
          comparisonValue: "",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });
    });

    describe("contains operator", () => {
      it("should return true when product value contains comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "contains",
          productValue: "test string",
          comparisonValue: "test",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when product value does not contain comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "contains",
          productValue: "hello world",
          comparisonValue: "test",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });

      it("should return true when comparison value is empty string", () => {
        const params: OperatorConditionParams = {
          operator: "contains",
          productValue: "test",
          comparisonValue: "",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });
    });

    describe("greater_than operator", () => {
      it("should return true when product value is greater than comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "greater_than",
          productValue: 10,
          comparisonValue: 5,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when product value is less than comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "greater_than",
          productValue: 3,
          comparisonValue: 5,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });

      it("should return true when comparison value is NaN", () => {
        const params: OperatorConditionParams = {
          operator: "greater_than",
          productValue: 5,
          comparisonValue: NaN,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });
    });

    describe("less_than operator", () => {
      it("should return true when product value is less than comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "less_than",
          productValue: 3,
          comparisonValue: 5,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when product value is greater than comparison value", () => {
        const params: OperatorConditionParams = {
          operator: "less_than",
          productValue: 10,
          comparisonValue: 5,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });
    });

    describe("any operator", () => {
      it("should return true when product value is not null or undefined", () => {
        const params: OperatorConditionParams = {
          operator: "any",
          productValue: "test",
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when product value is null", () => {
        const params: OperatorConditionParams = {
          operator: "any",
          productValue: null,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });

      it("should return false when product value is undefined", () => {
        const params: OperatorConditionParams = {
          operator: "any",
          productValue: undefined,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });
    });

    describe("none operator", () => {
      it("should return true when product value is null", () => {
        const params: OperatorConditionParams = {
          operator: "none",
          productValue: null,
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });
    });

    describe("in operator", () => {
      it("should return true when product value is in comparison array", () => {
        const params: OperatorConditionParams = {
          operator: "in",
          productValue: "test",
          comparisonValue: ["test", "other", "values"],
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });

      it("should return false when product value is not in comparison array", () => {
        const params: OperatorConditionParams = {
          operator: "in",
          productValue: "missing",
          comparisonValue: ["test", "other", "values"],
        };
        expect(checkMatchesOperatorCondition(params)).toBe(false);
      });

      it("should return true when comparison array is empty", () => {
        const params: OperatorConditionParams = {
          operator: "in",
          productValue: "test",
          comparisonValue: [],
        };
        expect(checkMatchesOperatorCondition(params)).toBe(true);
      });
    });
  });

  describe("getOperatorOptions", () => {
    beforeEach(() => {
      mockDatastore.getOperators.mockReturnValue(mockOperators);
    });

    it("should return correct operators for string property type", () => {
      const result = getOperatorOptions(mockOperators, "string");
      const expectedOperators = ["equals", "any", "none", "in", "contains"];

      expect(result).toHaveLength(5);
      expect(result.map((op) => op.value)).toEqual(
        expect.arrayContaining(expectedOperators),
      );
    });

    it("should return correct operators for number property type", () => {
      const result = getOperatorOptions(mockOperators, "number");
      const expectedOperators = [
        "equals",
        "greater_than",
        "less_than",
        "any",
        "none",
        "in",
      ];

      expect(result).toHaveLength(6);
      expect(result.map((op) => op.value)).toEqual(
        expect.arrayContaining(expectedOperators),
      );
    });

    it("should return correct operators for enumerated property type", () => {
      const result = getOperatorOptions(mockOperators, "enumerated");
      const expectedOperators = ["equals", "any", "none", "in"];

      expect(result).toHaveLength(4);
      expect(result.map((op) => op.value)).toEqual(
        expect.arrayContaining(expectedOperators),
      );
    });

    it("should return empty array when no property type is provided", () => {
      const result = getOperatorOptions(mockOperators, undefined);
      expect(result).toEqual([]);
    });
  });

  describe("getValueOptions", () => {
    it("should return formatted options from property values", () => {
      const propertyValues = ["red", "blue", "green"];
      const result = getValueOptions(propertyValues);

      expect(result).toEqual([
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
      ]);
    });

    it("should return empty array when no values provided", () => {
      expect(getValueOptions(null)).toEqual([]);
      expect(getValueOptions([])).toEqual([]);
      expect(getValueOptions(undefined)).toEqual([]);
    });
  });

  describe("getPropertiesOptions", () => {
    it("should return formatted property options", () => {
      const result = getPropertiesOptions(mockProperties);
      expect(result).toEqual([
        { value: "1", label: "color" },
        { value: "2", label: "size" },
        { value: "3", label: "price" },
      ]);
    });
  });

  describe("getSelectedProperty", () => {
    it("should return the correct property when found", () => {
      const selectedProperty = { value: "1", label: "color" };
      const result = getSelectedProperty(selectedProperty, mockProperties);

      expect(result).toEqual(mockProperties[0]);
    });

    it("should return null when property not found", () => {
      const selectedProperty = { value: "999", label: "nonexistent" };
      const result = getSelectedProperty(selectedProperty, mockProperties);

      expect(result).toBeNull();
    });

    it("should return null when no property selected", () => {
      const result = getSelectedProperty(null, mockProperties);
      expect(result).toBeNull();
    });
  });
});
