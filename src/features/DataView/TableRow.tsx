import { type Product } from "../../types";
import { ProductContext } from "./context";
import { useContext } from "react";

const rowClass =
  "border-t-2 border-zinc-800 bg-zinc-900 p-2 text-ellipsis overflow-hidden hover:bg-zinc-400 hover:text-zinc-800";

export default function ProductRow({ product }: { product: Product }) {
  const [state] = useContext(ProductContext);

  const getPropertyValue = (product: Product, propertyId: number) => {
    const propertyValue = product.property_values.find(
      ({ property_id }) => property_id === propertyId,
    );

    return propertyValue ? propertyValue.value : null;
  };

  return (
    <div role="row" className="contents">
      {state.properties.map(({ id }: { id: number }) => {
        const propertyValue = getPropertyValue(product, id);
        return (
          <div
            key={`product-${product.id}-property-${id}`}
            className={rowClass}
            role="cell"
          >
            {propertyValue ?? <span className="text-zinc-400">&mdash;</span>}
          </div>
        );
      })}
    </div>
  );
}
