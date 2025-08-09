import { type Product } from "../../types";

const rowClass =
  "border-t-1 border-slate-200 p-2 focus:outline-none focus:inset-ring-2 focus:inset-ring-blue-300";

export default function ProductRow({ product }: { product: Product }) {
  const properties = window.datastore.getProperties();

  const getPropertyValue = (product: Product, propertyId: number) => {
    const propertyValue = product.property_values.find(
      ({ property_id }) => property_id === propertyId,
    );

    return propertyValue ? propertyValue.value : null;
  };

  return (
    <div role="row" className="contents">
      {properties.map(({ id }: { id: number }) => {
        const propertyValue = getPropertyValue(product, id);
        return (
          <div
            key={`product-${product.id}-property-${id}`}
            className={rowClass}
            role="cell"
            tabIndex={0}
          >
            {propertyValue ?? <span className="text-slate-400 italic">—</span>}
          </div>
        );
      })}
    </div>
  );
}
