import { type OperatorConditionParams } from "../../types";
import { type State } from "./reducer";
import { type MultiValue, type SingleValue } from "react-select";
import {
  type SelectOptionType,
  type PropertyType,
  type Property,
} from "../../types";

const products = window.datastore.getProducts();

// Product table filtering utility functions

export const checkMatchesOperatorCondition = (
  props: OperatorConditionParams,
) => {
  const { operator, productValue, comparisonValue } = props;
  console.log("productValue", productValue);

  switch (operator) {
    case "equals":
      if (comparisonValue === "") return true;
      return productValue === comparisonValue;
    case "greater_than":
      if (isNaN(comparisonValue)) return true;
      return productValue > comparisonValue;
    case "less_than":
      if (isNaN(comparisonValue)) return true;
      return productValue < comparisonValue;
    case "any":
      return productValue !== null && productValue !== undefined;
    case "none":
      return productValue === null || productValue === undefined;
    case "in":
      if (comparisonValue.length === 0) return true;
      return comparisonValue.includes(productValue);
    case "contains":
      if (comparisonValue === "") return true;
      return (
        typeof productValue === "string" &&
        productValue.includes(comparisonValue)
      );
    default:
      return false;
  }
};

function buildOperatorParams(
  operator: string,
  productValue: string | number | undefined,
  selectedValues: MultiValue<SelectOptionType>,
  searchText: string,
): OperatorConditionParams {
  if (productValue === undefined) {
    return {
      operator: operator as "none",
      productValue: productValue as undefined,
    };
  }

  const isNumber = typeof productValue === "number";
  const parsedProductValue = isNumber
    ? productValue
    : productValue?.toLowerCase();

  if (operator === "in") {
    const comparisonValue = selectedValues.map(({ value }) => {
      return isNumber ? parseInt(value) : value;
    });

    return {
      operator: "in",
      productValue: parsedProductValue,
      comparisonValue: comparisonValue as string[] | number[],
    };
  } else {
    const comparisonValue = isNumber
      ? parseInt(searchText)
      : searchText.toLowerCase();

    if (operator === "contains" || operator === "equals") {
      return {
        operator: operator as "contains" | "equals",
        productValue: parsedProductValue as string,
        comparisonValue: comparisonValue as string,
      };
    }

    if (typeof productValue === "number") {
      return {
        operator: operator as "equals" | "greater_than" | "less_than",
        productValue: parsedProductValue as number,
        comparisonValue: comparisonValue as number,
      };
    }

    return {
      operator: operator as "any",
      productValue: parsedProductValue as string | number,
    };
  }
}

export function getFilteredProducts(state: State) {
  const { selectedProperty, selectedOperator, selectedValues, searchText } =
    state;

  if (selectedProperty?.value && selectedOperator?.value) {
    const propertyId = parseInt(selectedProperty?.value);

    return products.filter((product) => {
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
    return products;
  }
}

// Product Filters utility functions

const operatorsByPropertyType = {
  string: ["equals", "any", "none", "in", "contains"],
  number: ["equals", "greater_than", "less_than", "any", "none", "in"],
  enumerated: ["equals", "any", "none", "in"],
};

export function getOperatorOptions(selectedPropertyType?: PropertyType) {
  if (!selectedPropertyType) return [];
  const operators = window.datastore.getOperators();
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

export function getPropertiesOptions() {
  const properties = window.datastore.getProperties();

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
    return allProperties.find(
      (property) => property.id === parseInt(selectedProperty!.value),
    );
  }
  return null;
}
