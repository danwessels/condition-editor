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
