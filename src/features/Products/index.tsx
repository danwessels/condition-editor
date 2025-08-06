import ProductRow from "./ProductRow";

const headerRowClass = "font-semibold p-2";

export default function Products() {
  const products = window.datastore.getProducts();
  const properties = window.datastore.getProperties();

  return (
    <div
      className="grid border-1 border-slate-300 rounded-sm"
      style={{
        gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
      }}
    >
      {/* column headings */}
      {properties.map(({ id, name }) => {
        return (
          <div key={`property-${id}`} className={headerRowClass}>
            {name.slice(0, 1).toUpperCase() + name.slice(1)}
          </div>
        );
      })}
      {/* product rows */}
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
}
