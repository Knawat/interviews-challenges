import Button from '@material-ui/core/Button';
import { useContext } from 'react';
//Types
import { CartItemTypes } from '../App';
//Context
import { CartContext } from '../Context/globalContext';
//Styles
import { CartItemWrapper } from './CartItem.style';

type Props = {
    item: CartItemTypes;
};

const CartItem: React.FC<Props> = ({ item }) => {
    const { handleAddToCart, handleRemoveFromCart} = useContext(CartContext)

    return (
        <CartItemWrapper>
            <div>
                <h3>{item.name}</h3>
                <div className='information'>
                    <p>Price: ${item.price}</p>
                    <p>Total: ${(item.amount * item.price).toFixed(2)}</p>
                </div>
                <div className='buttons'>
                    <Button
                        size='small'
                        disableElevation
                        variant='contained'
                        onClick={() => handleRemoveFromCart(item.id)}
                    >
                        -
                    </Button>
                    <p>{item.amount}</p>
                    <Button
                        size='small'
                        disableElevation
                        variant='contained'
                        onClick={() => handleAddToCart(item)}
                    >
                        +
                    </Button>
                </div>
            </div>
            <img src={item.imageURL} alt={item.name} />
        </CartItemWrapper>
    )
}


export default CartItem;