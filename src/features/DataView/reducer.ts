import { type MultiValue, type SingleValue } from "react-select";
import {
  type SelectOptionType,
  type Property,
  type Operator,
  type Product,
} from "../../types";

import { type OperatorType } from "./utils";

export type OperatorOptionType = {
  value: OperatorType;
  label: string;
};

export interface State {
  selectedProperty: SingleValue<SelectOptionType>;
  selectedOperator: SingleValue<OperatorOptionType>;
  selectedValues: MultiValue<SelectOptionType>;
  searchText: string;
  properties: Property[];
  operators: Operator[];
  products: Product[];
  page: number;
}

interface UpdateAction {
  type: "update_property";
  value: SingleValue<SelectOptionType>;
}

interface UpdateOperatorAction {
  type: "update_operator";
  value: SingleValue<OperatorOptionType>;
}

interface UpdateValueAction {
  type: "update_values";
  value: MultiValue<SelectOptionType>;
}

interface UpdateSearchAction {
  type: "update_search_text";
  value: string;
}

interface ClearAllAction {
  type: "clear_all";
}

interface SetPageAction {
  type: "set_page";
  value: number;
}

export type Action =
  | UpdateAction
  | UpdateOperatorAction
  | UpdateValueAction
  | UpdateSearchAction
  | ClearAllAction
  | SetPageAction;

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "update_property": {
      return {
        ...state,
        selectedProperty: action.value,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
        page: 1, // Reset to first page when property changes
      };
    }
    case "update_operator": {
      return {
        ...state,
        selectedOperator: action.value,
        selectedValues: [],
        searchText: "",
        page: 1,
      };
    }
    case "update_values": {
      return {
        ...state,
        selectedValues: action.value,
        page: 1,
      };
    }
    case "update_search_text": {
      return {
        ...state,
        searchText: action.value,
        page: 1,
      };
    }
    case "clear_all": {
      return {
        ...state,
        selectedProperty: null,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
        page: 1,
      };
    }
    case "set_page": {
      return {
        ...state,
        page: action.value,
      };
    }
    default:
      return state;
  }
}
