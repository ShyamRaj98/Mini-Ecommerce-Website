import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ADD TO CART
  const addToCart = (product, variant = null, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) =>
        item.productId === product._id &&
        item.variant?.color === variant?.color &&
        item.variant?.size === variant?.size
    );

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === product._id &&
          item.variant?.color === variant?.color &&
          item.variant?.size === variant?.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem = {
        productId: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        variant: variant
          ? {
              color: variant.color,
              size: variant.size,
            }
          : null,
        quantity,
      };

      setCartItems((prev) => [...prev, newItem]);
    }
  };

  const increaseQty = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
