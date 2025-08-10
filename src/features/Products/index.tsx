import { useReducer } from "react";

import { ProductContext } from "./context";
import reducer from "./reducer";

import ProductRow from "./ProductRow";
import ProductFilters from "./ProductFilters";
import { getFilteredProducts } from "./utils";

const initialState = {
  selectedProperty: null,
  selectedOperator: null,
  selectedValues: [],
  searchText: "",
  properties: window?.datastore?.getProperties() || [],
  operators: window?.datastore?.getOperators() || [],
  products: window?.datastore?.getProducts() || [],
};

const headerRowClass = "font-semibold p-2 bg-slate-100";

export default function Products() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredProducts = getFilteredProducts(state);

  return (
    <div>
      <ProductContext value={[state, dispatch]}>
        <h1 className="mb-5">Products</h1>
        <ProductFilters />
        <div
          className="grid border-1 border-slate-300 rounded-sm  overflow-x-auto"
          style={{
            gridTemplateColumns: `repeat(${state.properties.length}, minmax(100px, 1fr))`,
          }}
          role="table"
          aria-label="Product data table"
        >
          {/* column headings */}
          {state.properties.map(({ id, name }) => {
            return (
              <div
                key={`property-${id}`}
                className={headerRowClass}
                role="columnheader"
              >
                {name.slice(0, 1).toUpperCase() + name.slice(1)}
              </div>
            );
          })}
          {/* product rows */}
          {filteredProducts?.length > 0 &&
            filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          {filteredProducts?.length === 0 && (
            <div className="col-span-full p-4 text-center text-slate-500">
              No products match the current filters.
            </div>
          )}
        </div>
      </ProductContext>
    </div>
  );
}
