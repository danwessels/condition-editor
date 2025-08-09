interface PropertyProduct {
  property_id: number;
  value: string | number;
}

export interface Product {
  id: number;
  property_values: PropertyProduct[];
}

export type PropertyType = "string" | "number" | "enumerated";

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
  values?: string[];
}

export type SelectOptionType = { value: string; label: string };

// Operators to filter products based on their properties

type StringComparison = {
  operator: "equals" | "contains";
  productValue: string;
  comparisonValue: string;
};

type NumberComparison = {
  operator: "equals" | "greater_than" | "less_than";
  productValue: number;
  comparisonValue: number;
};

type InOperator = {
  operator: "in";
  productValue: string | number;
  comparisonValue: Array<string | number>;
};

type AnyOrNone = {
  operator: "any" | "none";
  productValue: string | number;
  comparisonValue?: undefined;
};

export type OperatorConditionParams =
  | InOperator
  | StringComparison
  | NumberComparison
  | AnyOrNone;
