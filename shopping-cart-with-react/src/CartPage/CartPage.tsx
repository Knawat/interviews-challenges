import { useContext } from "react";
//Styles
import Grid from "@material-ui/core/Grid"
import { CartPageWrapper } from "./CartPage.style";
//Types
import { CartContext } from "../Context/globalContext";
//COmponent
import { CartItemTypes } from "../App";
import CartSingle from "./CartSingle/CartSingle";



const CartPage: React.FC = () => {
    const { cartItems } = useContext(CartContext)

    const calculateTotal = (items: CartItemTypes[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

    const cartItemsMap = (): JSX.Element[] => {
        return cartItems.map((item, key) => {
            return (
                <Grid item key={key} xs={12} sm={6}>
                    <CartSingle
                        key={item.id}
                        item={item}
                    />
                </Grid>
            )
        })
    }

    return (
        <CartPageWrapper>
            <div className="main-bar">
                <h2>Shopping Cart Page</h2>
            </div>
            {cartItems.length === 0 ? <p>No Items</p> : null}
            <Grid container spacing={5}>
                {cartItemsMap()}
            </Grid>
            <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </CartPageWrapper>
    )
}

export default CartPage;





