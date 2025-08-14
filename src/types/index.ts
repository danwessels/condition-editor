import { type OperatorType } from "../features/DataView/utils";

interface PropertyProduct {
  property_id: number;
  value: string | number;
}

export interface Operator {
  text: string;
  id: OperatorType;
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

type Any = {
  operator: "any";
  productValue: string | number | undefined | null;
  comparisonValue?: undefined;
};

type None = {
  operator: "none";
  productValue: undefined | null;
  comparisonValue?: undefined;
};

export type OperatorConditionParams =
  | InOperator
  | StringComparison
  | NumberComparison
  | Any
  | None;
