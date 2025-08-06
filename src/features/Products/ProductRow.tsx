type Product = {
  id: number;
  property_values: Array<{
    property_id: number;
    value: string | number;
  }>;
};

export default function ProductRow({ product }: { product: Product }) {
  const properties = window.datastore.getProperties();

  const getPropertyValue = (product: Product, propertyId: number) => {
    const propertyValue = product.property_values.find(
      ({ property_id }) => property_id === propertyId,
    );

    return propertyValue ? propertyValue.value : null;
  };

  return (
    <>
      {properties.map(({ id }: { id: number }) => {
        const propertyValue = getPropertyValue(product, id);
        return (
          <div key={`product-${product.id}-property-${id}`}>
            {propertyValue}
          </div>
        );
      })}
    </>
  );
}
