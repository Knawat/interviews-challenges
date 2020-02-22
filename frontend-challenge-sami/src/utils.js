export const getProductPrice = product => {
  const variations = product.variations;
  const price = variations[0] && variations[0].sale_price;

  return price.toFixed(2) || 0;
};

export const getProductSizes = product => {
  const attributes = product.attributes;
  const getSizeAttr = attr => {
    if (attr.name && attr.name.en) {
      return attr.name.en === "Size";
    }

    return {};
  };

  const { options: localizedOptions } = (attributes &&
    attributes.find(attr => getSizeAttr(attr))) || { localizedOptions: [] };
  const options = localizedOptions.map(op => op.en);

  return options;
};

export const getProductWeight = product => {
  const variations = product.variations;
  const weight = variations[0] && variations[0].weight;

  return weight || 0;
};
