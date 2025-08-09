import { type OperatorConditionParams } from "../../types";
import { type State } from "./reducer";
import { type MultiValue } from "react-select";
import { type SelectOptionType } from "../../types";

const products = window.datastore.getProducts();

export const checkMatchesOperatorCondition = (
  props: OperatorConditionParams,
) => {
  const { operator, productValue, comparisonValue } = props;

  switch (operator) {
    case "equals":
      if (productValue === null || comparisonValue === "") return true;
      return productValue == comparisonValue;
    case "greater_than":
      return productValue > comparisonValue;
    case "less_than":
      return productValue < comparisonValue;
    case "any":
      return productValue !== null && productValue !== undefined;
    case "none":
      return productValue === null || productValue === undefined;
    case "in":
      return comparisonValue.includes(productValue);
    case "contains":
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
  productValue: string | number,
  selectedValues: MultiValue<SelectOptionType>,
  searchText: string,
): OperatorConditionParams {
  const isNumber = typeof productValue === "number";
  const parsedProductValue = isNumber
    ? productValue
    : productValue.toLowerCase();

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
        operator: "contains",
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
      operator: operator as "any" | "none",
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

      if (productProperty) {
        // Parse the product value to match the expected type
        const params = buildOperatorParams(
          selectedOperator.value,
          productProperty.value,
          selectedValues,
          searchText,
        );

        return checkMatchesOperatorCondition(params);
      }

      return false;
    });
  } else {
    return products;
  }
}
