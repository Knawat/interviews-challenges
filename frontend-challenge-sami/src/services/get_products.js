import { callApi } from "./index.js";

export const getProducts = async () => {
  const { products, total } = await callApi(`/api/catalog/products?page=1`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return { products, total };
};
