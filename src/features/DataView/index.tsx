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
  page: 1,
};

const headerRowClass = "font-medium p-2 bg-zinc-800 text-zinc-300";
const pageLength = 10;

function insertToggleButton(view: "table" | "orbit", toggleView: () => void) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`text-sm font-medium ${view === "table" ? "text-blue-400" : "text-zinc-400"} transition-colors duration-200`}
      >
        Table
      </span>
      <div
        onClick={toggleView}
        className="relative w-16 h-8 bg-zinc-700 rounded-full cursor-pointer transition-colors duration-200 hover:bg-zinc-600"
      >
        <div
          className={`w-6 h-6 bg-blue-400 absolute transition-all duration-300 ease-in-out top-1 ${view === "table" ? "left-1" : "left-9"} rounded-full shadow-md`}
        />
      </div>
      <span
        className={`text-sm font-medium ${view === "orbit" ? "text-blue-400" : "text-zinc-400"} transition-colors duration-200`}
      >
        Orbit
      </span>
    </div>
  );
}

export default function Products() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [view, setView] = useState<"table" | "orbit">("table");

  const filteredProducts = getFilteredProducts(state);
  const pageCount = Math.ceil(filteredProducts.length / pageLength);

  function toggleView() {
    setView((prev) => (prev === "table" ? "orbit" : "table"));
  }

  function nextPage() {
    if (state.page < pageCount) {
      dispatch({ type: "set_page", value: state.page + 1 });
    }
  }

  function prevPage() {
    if (state.page > 1) {
      dispatch({ type: "set_page", value: state.page - 1 });
    }
  }

  if (!state.products || state.products.length === 0) {
    return <div className="p-4 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <ProductContext value={[state, dispatch]}>
        <h1 className="mb-2 text-orange-400 font-semibold font-mono">
          Near Earth Comets
        </h1>
        <p className="mb-5 text-zinc-300 font-light max-w-prose">
          Discover comets that have orbits near Earth. The data presented here
          is from the{" "}
          <a
            className="text-blue-400 font-medium hover:underline"
            target="_blank"
            href="https://data.nasa.gov/dataset/near-earth-comets-orbital-elements"
          >
            NASA Open Data Portal
          </a>
          . Use the filters below to refine your search.
        </p>
        <ProductFilters />
        <div className="flex justify-between items-end mb-4 mt-10">
          <h2 className="text-xl font-medium text-orange-400 font-mono">
            {view === "table"
              ? "Comets data table"
              : "Comets orbit visualization"}
          </h2>
          {insertToggleButton(view, toggleView)}
        </div>
        {view === "table" && (
          <div
            className="grid border-1 border-zinc-700 rounded-lg text-zinc-400 overflow-x-auto text-sm"
            style={{
              gridTemplateColumns: `repeat(${state.properties.length}, minmax(100px, 1fr))`,
            }}
            role="table"
            aria-label="Near earth comets data table"
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
                .slice((state.page - 1) * pageLength, state.page * pageLength)
                .map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
            {filteredProducts?.length === 0 && (
              <div className="col-span-full p-4 text-center text-zinc-400">
                No comets match the current filters.
              </div>
            )}
          </div>
        )}
        {
          /* Pagination controls */ view === "table" &&
            filteredProducts?.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={prevPage}
                  label="Prev"
                  disabled={state.page === 1}
                />
                <p className="text-zinc-300">{`Page ${state.page} of ${pageCount}`}</p>
                <Button
                  onClick={nextPage}
                  label="Next"
                  disabled={state.page === pageCount}
                />
              </div>
            )
        }
        {view === "orbit" && <OrbitVisualization comets={filteredProducts} />}
      </ProductContext>
    </div>
  );
}
