import { useState, useContext } from 'react'
//State
import { CartContext } from '../Context/globalContext'
//Style
import { HeaderWrapper, StyledButton } from './Header.style'
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge"
import { CartItemTypes } from '../App'
//Api
import { Link } from "react-router-dom"
//Component
import Drawer from '@material-ui/core/Drawer'
import Cart from '../Cart/Cart'



const Header: React.FC = () => {
    const [cartOpen, setCartOpen] = useState(false)
    const { cartItems } = useContext(CartContext)
    const getTotalItems = (items: CartItemTypes[]) => items.reduce((acc: number, item) => acc + item.amount, 0);
    return (
        <HeaderWrapper>
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>

                    </li>
                    <li>

                        <Link to='/products'>Products</Link>
                    </li>
                </ul>
            </nav>
            <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
                <Cart cartClose={setCartOpen} />
            </Drawer>
            <StyledButton onMouseEnter={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                    <AddShoppingCartIcon />
                </Badge>
            </StyledButton>
        </HeaderWrapper>
    )
}

export default Header