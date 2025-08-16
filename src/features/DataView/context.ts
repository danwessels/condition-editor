import { createContext } from "react";
import { type State, type Action } from "./reducer";

// Default initial state for the context (empty state)
const initialState: State = {
  selectedProperty: null,
  selectedOperator: null,
  selectedValues: [],
  searchText: "",
  properties: [],
  operators: [],
  products: [],
  page: 1,
};

// Create context with default empty values
export const ProductContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
]);
