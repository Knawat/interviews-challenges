import Button from "@material-ui/core/Button";
import { useContext} from "react";
//Types
import { CartItemTypes } from "../App";
import { CartContext } from "../Context/globalContext";
//Styles
import { ItemWrapper } from "./Item.style";


type Props = {
    item: CartItemTypes;
}


const Item: React.FC<Props> =({ item }) => {
    const { handleAddToCart } = useContext(CartContext)

    return (
        <ItemWrapper>
        <img src={item.imageURL} alt={item.name}/>
        <div>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <h3>${item.price}</h3>
        </div> 
        <Button onClick={() => handleAddToCart(item)} >Add Cart</Button>
    </ItemWrapper>
    )
}
    

    

export default Item;