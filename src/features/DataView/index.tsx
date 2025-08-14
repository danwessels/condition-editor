import { useReducer, useState } from "react";

import { ProductContext } from "./context";
import reducer from "./reducer";

import ProductRow from "./TableRow";
import ProductFilters from "./DataFilters";
import { getFilteredProducts } from "./utils";
import OrbitVisualization from "../OrbitVisualisation";
import { Button } from "../../components";

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
const pageLength = 10;

export default function Products() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [view, setView] = useState<"table" | "orbit">("table");
  const [page, setPage] = useState(1);

  const filteredProducts = getFilteredProducts(state);
  const pageCount = Math.ceil(filteredProducts.length / pageLength);

  return (
    <div>
      <ProductContext value={[state, dispatch]}>
        <h1 className="mb-5">Near Earth Comets</h1>
        <ProductFilters />
        <div className="mb-4 flex gap-2">
          <Button onClick={() => setView("table")} label="Table view" />
          <Button onClick={() => setView("orbit")} label="Orbit view" />
        </div>
        {view === "table" && (
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
              filteredProducts
                .slice((page - 1) * pageLength, page * pageLength)
                .map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
            {filteredProducts?.length === 0 && (
              <div className="col-span-full p-4 text-center text-slate-500">
                No products match the current filters.
              </div>
            )}
          </div>
        )}
        {
          /* Pagination controls */ view === "table" &&
            filteredProducts?.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setPage((prev) => prev - 1)}
                  label="Prev"
                  disabled={page === 1}
                />
                <p>{`Page ${page} of ${pageCount}`}</p>
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  label="Next"
                  disabled={page === pageCount}
                />
              </div>
            )
        }
        {view === "orbit" && (
          <div>
            <OrbitVisualization comets={filteredProducts} />
            {filteredProducts?.length === 0 && (
              <div className="p-4 text-center text-slate-500">
                No comets match the current filters.
              </div>
            )}
          </div>
        )}
      </ProductContext>
    </div>
  );
}
