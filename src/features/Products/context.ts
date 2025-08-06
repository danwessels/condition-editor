import { createContext } from "react";
import { type State, type Action } from "./reducer";

const initialState = {
  selectedProperty: null,
  selectedOperator: null,
  selectedValues: [],
  searchText: "",
};

export const ProductContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
]);
