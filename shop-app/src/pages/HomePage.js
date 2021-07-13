import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
// import { ProductContext } from "../context/ProductContext";
import loadingGif from "../assets/loading.gif";
import { useParams, useLocation } from "react-router-dom";

const FEATURED_API = "https://fakestoreapi.com/products";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const params = useParams();
  const [loading, setLoading] = useState(false);
  let location = useLocation()

  useEffect(() => {
    if (getSecondPart(location?.search)) {
      getProducts(`${FEATURED_API}/category/${getSecondPart(location?.search)}`);
    } else {
      getProducts(`${FEATURED_API}`);
    }
  }, [setProducts, getSecondPart(location?.search)]);

  const getProducts = (API) => {
    setLoading(true);
    axios.get(API).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  function getSecondPart(str = "= ") {
    return str?.split('=')[1]?.replace("%20", " ");
  }

  // console.log(params)
  // console.log(getSecondPart(location?.search))

  return (
    <div >
      {loading ? (
        <div className='loading-image'>
          <img src={loadingGif} alt="loading" /> </div>
      ) : (
        <div className="product-container">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default HomePage;

