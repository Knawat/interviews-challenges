import React, { createContext, useState } from "react";
import { CartItemTypes } from "../App";

type CartItemsContextState = {
    cartItems: CartItemTypes[];
    handleAddToCart: (clickedItem: CartItemTypes) => void;
    handleRemoveFromCart: (id: number) => void;
  };

  const contextDefaultValues: CartItemsContextState = {
    cartItems: [],
    handleAddToCart: () => {},
    handleRemoveFromCart: () => {}
  };
  
  export const CartContext = createContext<CartItemsContextState>(
    contextDefaultValues
  );

  const CartProvider: React.FC = ({ children }) => {
    const [cartItems, setCartItems] = useState([] as CartItemTypes[]);
  
    const handleAddToCart = (clickedItem: CartItemTypes) => {
        setCartItems(prev => {
          const isItemInCart = prev.find(item => item.id === clickedItem.id);
    
          if (isItemInCart) {
            return prev.map(item =>
              item.id === clickedItem.id
                ? { ...item, amount: item.amount + 1 }
                : item
            );
          }
          // First time the item is added
          return [...prev, { ...clickedItem, amount: 1 }];
        });
      };
      const handleRemoveFromCart = (id: number) => {
        setCartItems(prev =>
          prev.reduce((ack, item) => {
            if (item.id === id) {
              if (item.amount === 1) return ack;
              return [...ack, { ...item, amount: item.amount - 1 }];
            } else {
              return [...ack, item];
            }
          }, [] as CartItemTypes[])
        );
      };
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          handleAddToCart,
          handleRemoveFromCart
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  
  export default CartProvider;