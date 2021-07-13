import React, { createContext, useState } from "react";
const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const removeProduct = (product) => {
    setProducts(products.filter((prd) => {
      console.log(prd)
      console.log(product)
      return prd.id !== product
    }))
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductContextProvider };
