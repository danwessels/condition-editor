import { type MultiValue, type SingleValue } from "react-select";
import { type SelectOptionType } from "../../types";

export interface State {
  selectedProperty: SingleValue<SelectOptionType>;
  selectedOperator: SingleValue<SelectOptionType>;
  selectedValues: MultiValue<SelectOptionType>;
  searchText: string;
}

interface UpdateAction {
  type: "update_property" | "update_operator";
  value: SingleValue<SelectOptionType>;
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

export type Action =
  | UpdateAction
  | UpdateValueAction
  | UpdateSearchAction
  | ClearAllAction;

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "update_property": {
      return {
        ...state,
        selectedProperty: action.value,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
      };
    }
    case "update_operator": {
      return {
        ...state,
        selectedOperator: action.value,
        selectedValues: [],
        searchText: "",
      };
    }
    case "update_values": {
      return {
        ...state,
        selectedValues: action.value,
      };
    }
    case "update_search_text": {
      return {
        ...state,
        searchText: action.value,
      };
    }
    case "clear_all": {
      return {
        ...state,
        selectedProperty: null,
        selectedOperator: null,
        selectedValues: [],
        searchText: "",
      };
    }
    default:
      return state;
  }
}
