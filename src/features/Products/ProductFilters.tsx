import { useReducer } from "react";
import { type MultiValue, type SingleValue } from "react-select";

import { Select } from "../../components";
import { type SelectOptionType, type PropertyType } from "../../types";

const operatorsByPropertyType = {
  string: ["equals", "any", "none", "in", "contains"],
  number: ["equals", "greater_than", "less_than", "any", "none", "in"],
  enumerated: ["equals", "any", "none", "in"],
};

function getOperatorOptions(selectedPropertyType?: PropertyType) {
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

function getValueOptions(selectedPropertyValues?: string[] | null) {
  if (!selectedPropertyValues || selectedPropertyValues?.length === 0)
    return [];

  return selectedPropertyValues.map((label, index) => ({
    value: index.toString(),
    label: label.slice(0, 1).toUpperCase() + label.slice(1),
  }));
}

function getPropertiesOptions() {
  const properties = window.datastore.getProperties();

  return properties.map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }));
}

interface State {
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

type Action =
  | UpdateAction
  | UpdateValueAction
  | UpdateSearchAction
  | ClearAllAction;

const initialState = {
  selectedProperty: null,
  selectedOperator: null,
  selectedValues: [],
  searchText: "",
};

function reducer(state: State, action: Action): State {
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

export default function ProductFilters() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const allProperties = window.datastore.getProperties();

  const selectedProperty =
    state?.selectedProperty &&
    state.selectedProperty?.value !== undefined &&
    state.selectedProperty?.value !== null
      ? allProperties.find(
          (property) => property.id === parseInt(state.selectedProperty!.value),
        )
      : null;

  const propertyOptions = getPropertiesOptions();
  const operatorOptions = getOperatorOptions(selectedProperty?.type);
  const valueOptions = getValueOptions(selectedProperty?.values);

  function onSelectProperty(selected: SingleValue<SelectOptionType>) {
    dispatch({
      type: "update_property",
      value: selected,
    });
  }

  function onSelectOperator(selected: SingleValue<SelectOptionType>) {
    dispatch({
      type: "update_operator",
      value: selected,
    });
  }

  function onSelectValue(selected: MultiValue<SelectOptionType>) {
    dispatch({
      type: "update_values",
      value: selected,
    });
  }

  function onChangeInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "update_search_text",
      value: e.target.value,
    });
  }

  const showAnyValueField =
    state.selectedOperator?.value &&
    !["any", "none"].includes(state.selectedOperator?.value);

  return (
    <div className="flex gap-2 mb-4">
      <Select
        options={propertyOptions}
        placeholder="Select property"
        onChange={onSelectProperty}
        key="property-select"
        value={state.selectedProperty}
      />
      <Select
        options={operatorOptions}
        placeholder="Select operator"
        onChange={onSelectOperator}
        key="operator-select"
        value={state.selectedOperator}
      />
      {showAnyValueField && (
        <>
          {valueOptions?.length === 0 && (
            <input
              type="text"
              placeholder="Enter value"
              className="w-full border border-slate-300 rounded-sm px-2"
              onChange={onChangeInputValue}
              key="value-input"
              value={state.searchText}
            />
          )}
          {valueOptions?.length > 0 && (
            <Select
              options={valueOptions}
              placeholder="Select value(s)"
              onChange={onSelectValue}
              isMulti={true}
              key="value-select"
              value={state.selectedValues}
            />
          )}
        </>
      )}
    </div>
  );
}
