import { useContext } from "react";
import { type MultiValue, type SingleValue } from "react-select";

import { Select, Button } from "../../components";
import { type SelectOptionType } from "../../types";
import { type OperatorOptionType } from "./reducer";
import { ProductContext } from "./context";
import {
  getOperatorOptions,
  getValueOptions,
  getPropertiesOptions,
  getSelectedProperty,
} from "./utils";

const fieldContainerClass = "w-full sm:w-1/2 md:w-1/3 h-auto pr-3 mb-3";
const inputClass =
  "w-full h-full border border-zinc-600 rounded-md px-3 py-2 bg-zinc-800 text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none hover:border-zinc-500 transition-colors";

export default function ProductFilters() {
  const [state, dispatch] = useContext(ProductContext);

  const selectedProperty = getSelectedProperty(
    state?.selectedProperty,
    state.properties,
  );

  const propertyOptions = getPropertiesOptions(state.properties);
  const operatorOptions = getOperatorOptions(
    state.operators,
    selectedProperty?.type,
  );
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
      value: selected as SingleValue<OperatorOptionType>,
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

  function clearFilters() {
    dispatch({ type: "clear_all" });
  }

  const getInputType = () => {
    if (selectedProperty?.type === "number") {
      return "number";
    }
    return "text";
  };

  const operatorsToHideInput = ["any", "none", "in", undefined];
  const hideInput = operatorsToHideInput.includes(
    state.selectedOperator?.value,
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:gap-4 border-amber-600 border-b-1">
      <div className="flex flex-wrap max-w-[50rem] w-full">
        <div className={fieldContainerClass}>
          <Select
            options={propertyOptions}
            placeholder="Select a property"
            onChange={onSelectProperty}
            key="property-select"
            value={state.selectedProperty}
          />
        </div>
        <div className={fieldContainerClass}>
          {state.selectedProperty && (
            <Select
              options={operatorOptions}
              placeholder="Select an operator"
              onChange={onSelectOperator}
              key="operator-select"
              value={state.selectedOperator}
            />
          )}
        </div>
        <div className={fieldContainerClass}>
          {!hideInput && (
            <input
              name="comparison-value"
              type={getInputType()}
              placeholder="Enter value"
              className={inputClass}
              onChange={onChangeInputValue}
              key="value-input"
              value={state.searchText}
            />
          )}
          {state.selectedOperator && state.selectedOperator?.value === "in" && (
            <Select
              options={valueOptions}
              placeholder={
                valueOptions?.length > 0
                  ? "Select one or more values"
                  : "Enter one or more values"
              }
              onChange={onSelectValue}
              isMulti={true}
              key="value-select"
              value={state.selectedValues}
              isCreatable={valueOptions?.length === 0} // Allow user to add options if is not enumerated and has no predefined values
            />
          )}
        </div>
      </div>
      <Button onClick={clearFilters} label="Clear filters" />
    </div>
  );
}
