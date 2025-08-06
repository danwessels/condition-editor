import ProductRow from "./ProductRow";

export default function Products() {
  const products = window.datastore.getProducts();
  const properties = window.datastore.getProperties();

  return (
    <div
      className="grid gap-2 items-center"
      style={{
        gridTemplateColumns: `repeat(${properties.length}, minmax(0, 1fr))`,
      }}
    >
      {/* column headings */}
      {properties.map(({ id, name }) => {
        return (
          <div key={`property-${id}`} className="font-semibold">
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
