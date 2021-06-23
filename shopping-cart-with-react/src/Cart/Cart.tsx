import { useContext } from "react";
//Styles
import { CartWrapper } from "./Cart.style";
//Types
import { CartContext } from "../Context/globalContext";
//COmponent
import CartItem from "../CartItem/CartItem";
import { CartItemTypes } from "../App";
import { Link } from "react-router-dom"
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Button from '@material-ui/core/Button'

type Props = {
    cartClose: React.Dispatch<React.SetStateAction<boolean>>
}


const Cart: React.FC<Props> = ({ cartClose }) => {
    const { cartItems } = useContext(CartContext)

    const calculateTotal = (items: CartItemTypes[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

    const cartItemsMap = (): JSX.Element[] => {
        return cartItems.map(item =>
            <CartItem
                key={item.id}
                item={item}
            />
        )
    }

    return (
        <CartWrapper>
            <div className="main-bar">
                <div className="link" onClick={() => cartClose(false)}>
                    <Link to='/products'>Shopping Cart</Link>
                    <AddShoppingCartIcon />
                </div>
                <Button variant="contained" color="secondary" onClick={() => cartClose(false)}>
                    Close
                </Button>
            </div>
            {cartItems.length === 0 ? <p>No Items</p> : null}
            {cartItemsMap()}
            <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </CartWrapper>
    )
}

export default Cart;





