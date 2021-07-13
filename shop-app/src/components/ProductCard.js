import React from "react";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import { ProductContext } from "../context/ProductContext";

const ProductCard = ({ product }) => {
  const { addProduct } = React.useContext(ProductContext);

  const history = useHistory();
  const viewDetails = () => {
    history.push({
      pathname: "/detailPage",
      product: product,
    });
  };

  React.useEffect(() => {
  }, []);

  const addToCart = () => {
    addProduct(product);
  };

  return (
    <div className="product">
      <img src={product?.image} alt="product" />
      <div className="product-info">
        <p>{product?.title}</p>
        <p>${product?.price}</p>
        <IconButton
          to="/DetailPage"
          color="primary"
          aria-label="add to shopping cart"
        >
          <AddShoppingCartIcon onClick={addToCart} />
        </IconButton>
        <Button onClick={viewDetails} variant="contained">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
