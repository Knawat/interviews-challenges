import { callApi } from "./index.js";

export const getProducts = async page => {
  const { products, total } = await callApi(
    `/api/catalog/products?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return { products, total };
};
