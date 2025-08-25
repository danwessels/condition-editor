import { type OperatorConditionParams } from "../../types";
import { type State } from "./reducer";
import { type MultiValue, type SingleValue } from "react-select";
import {
  type SelectOptionType,
  type PropertyType,
  type Property,
  type Operator,
} from "../../types";

const OPERATOR_TYPES = {
  EQUALS: "equals",
  CONTAINS: "contains",
  GREATER_THAN: "greater_than",
  LESS_THAN: "less_than",
  IN: "in",
  ANY: "any",
  NONE: "none",
} as const;

export type OperatorType = (typeof OPERATOR_TYPES)[keyof typeof OPERATOR_TYPES];

// Product table filtering utility functions

export const checkMatchesOperatorCondition = (
  props: OperatorConditionParams,
) => {
  const { operator, productValue, comparisonValue } = props;
  switch (operator) {
    case OPERATOR_TYPES.EQUALS:
      if (typeof comparisonValue === "string" && comparisonValue === "")
        return true;
      if (typeof comparisonValue === "number" && isNaN(comparisonValue))
        return true;
      return productValue === comparisonValue;
    case OPERATOR_TYPES.GREATER_THAN:
      if (isNaN(comparisonValue)) return true;
      return productValue > comparisonValue;
    case OPERATOR_TYPES.LESS_THAN:
      if (isNaN(comparisonValue)) return true;
      return productValue < comparisonValue;
    case OPERATOR_TYPES.ANY:
      return productValue !== null && productValue !== undefined;
    case OPERATOR_TYPES.NONE:
      return productValue === null || productValue === undefined;
    case OPERATOR_TYPES.IN:
      if (comparisonValue.length === 0) return true;
      return comparisonValue.includes(productValue);
    case OPERATOR_TYPES.CONTAINS:
      if (comparisonValue === "") return true;
      return (
        typeof productValue === "string" &&
        productValue.includes(comparisonValue)
      );
    default:
      return false;
  }
};

const parseComparisonValue = (
  value: string | number,
  shouldParseToNumber: boolean,
) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return shouldParseToNumber ? parseInt(value) : value.toLowerCase();
  }
};

function buildOperatorParams(
  operator: string,
  productValue: string | number | undefined,
  selectedValues: MultiValue<SelectOptionType>,
  searchText: string | number,
): OperatorConditionParams {
  if (operator === OPERATOR_TYPES.NONE) {
    return {
      operator: OPERATOR_TYPES.NONE,
      productValue: productValue as undefined | null,
    };
  }

  const isNumberComparison = typeof productValue === "number";
  const parsedProductValue = isNumberComparison
    ? productValue
    : (productValue?.toLowerCase() ?? "");

  if (operator === OPERATOR_TYPES.IN) {
    const comparisonValue = selectedValues.map(({ value }) => {
      return isNumberComparison ? parseInt(value) : value.toLowerCase();
    });

    return {
      operator: OPERATOR_TYPES.IN,
      productValue: parsedProductValue,
      comparisonValue: comparisonValue as string[] | number[],
    };
  } else {
    const comparisonValue = parseComparisonValue(
      searchText,
      isNumberComparison,
    );

    if (
      typeof productValue === "string" &&
      (operator === OPERATOR_TYPES.CONTAINS ||
        operator === OPERATOR_TYPES.EQUALS)
    ) {
      return {
        operator: operator as "contains" | "equals",
        productValue: parsedProductValue as string,
        comparisonValue: comparisonValue as string,
      };
    }

    if (isNumberComparison) {
      return {
        operator: operator as "equals" | "greater_than" | "less_than",
        productValue: parsedProductValue as number,
        comparisonValue: comparisonValue as number,
      };
    }

    return {
      operator: OPERATOR_TYPES.ANY,
      productValue: productValue as string | number | undefined,
    };
  }
}

export function getFilteredProducts(state: State) {
  const { selectedProperty, selectedOperator, selectedValues, searchText } =
    state;

  if (selectedProperty?.value && selectedOperator?.value) {
    const propertyId = parseInt(selectedProperty?.value);

    return state.products.filter((product) => {
      // Find the property value for the selected property
      const productProperty = product.property_values.find(
        ({ property_id }) => property_id === propertyId,
      );

      const params = buildOperatorParams(
        selectedOperator.value,
        productProperty ? productProperty?.value : productProperty,
        selectedValues,
        searchText,
      );

      return checkMatchesOperatorCondition(params);
    });
  } else {
    return state.products;
  }
}

// Product Filters utility functions

const operatorsByPropertyType: Record<PropertyType, OperatorType[]> = {
  string: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
    OPERATOR_TYPES.CONTAINS,
  ],
  number: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.GREATER_THAN,
    OPERATOR_TYPES.LESS_THAN,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
  ],
  enumerated: [
    OPERATOR_TYPES.EQUALS,
    OPERATOR_TYPES.ANY,
    OPERATOR_TYPES.NONE,
    OPERATOR_TYPES.IN,
  ],
};

export function getOperatorOptions(
  operators: Operator[],
  selectedPropertyType?: PropertyType,
) {
  if (!selectedPropertyType || operators?.length === 0) return [];
  const validOperators = operatorsByPropertyType[selectedPropertyType];

  return operators
    .filter(({ id }) => validOperators.includes(id))
    .map(({ id, text }) => ({
      value: id,
      label: text,
    }));
}

export function getValueOptions(selectedPropertyValues?: string[] | null) {
  if (!selectedPropertyValues || selectedPropertyValues?.length === 0)
    return [];

  return selectedPropertyValues.map((label) => ({
    value: label,
    label: label.slice(0, 1).toUpperCase() + label.slice(1),
  }));
}

export function getPropertiesOptions(properties: Property[]) {
  return properties.map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }));
}

export function getSelectedProperty(
  selectedProperty: SingleValue<SelectOptionType>,
  allProperties: Property[],
) {
  if (selectedProperty?.value) {
    return (
      allProperties.find(
        (property) => property.id === parseInt(selectedProperty!.value),
      ) ?? null
    );
  }
  return null;
}
