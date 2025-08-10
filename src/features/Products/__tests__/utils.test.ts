import {
  checkMatchesOperatorCondition,
  getOperatorOptions,
  getValueOptions,
  getPropertiesOptions,
  getSelectedProperty,
} from "../utils";
import type { OperatorConditionParams, Property } from "../../../types";

// Get the global mock datastore from setupTests
declare const mockDatastore: {
  getOperators: jest.Mock;
  getProperties: jest.Mock;
  getProducts: jest.Mock;
};

describe("utils.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      mockDatastore.getOperators.mockReturnValue([
        { id: "equals", text: "Equals" },
        { id: "contains", text: "Contains" },
        { id: "greater_than", text: "Greater Than" },
        { id: "less_than", text: "Less Than" },
        { id: "any", text: "Any" },
        { id: "none", text: "None" },
        { id: "in", text: "In" },
      ]);
    });

    it("should return correct operators for string property type", () => {
      const result = getOperatorOptions("string");
      const expectedOperators = ["equals", "any", "none", "in", "contains"];

      expect(result).toHaveLength(5);
      expect(result.map((op) => op.value)).toEqual(
        expect.arrayContaining(expectedOperators),
      );
    });

    it("should return correct operators for number property type", () => {
      const result = getOperatorOptions("number");
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
      const result = getOperatorOptions("enumerated");
      const expectedOperators = ["equals", "any", "none", "in"];

      expect(result).toHaveLength(4);
      expect(result.map((op) => op.value)).toEqual(
        expect.arrayContaining(expectedOperators),
      );
    });

    it("should return empty array when no property type is provided", () => {
      const result = getOperatorOptions();
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
      const mockProperties = [
        { id: 1, name: "color", type: "string" },
        { id: 2, name: "size", type: "number" },
      ];

      mockDatastore.getProperties.mockReturnValue(mockProperties);

      const result = getPropertiesOptions();
      expect(result).toEqual([
        { value: "1", label: "color" },
        { value: "2", label: "size" },
      ]);
    });
  });

  describe("getSelectedProperty", () => {
    const mockProperties: Property[] = [
      { id: 1, name: "color", type: "string" },
      { id: 2, name: "size", type: "number" },
    ];

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
