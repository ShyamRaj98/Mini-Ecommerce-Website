import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeItem, totalPrice } =
    useCart();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="h-full max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Your cart is empty 🛒
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven’t added anything yet.
            </p>

            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="h-full flex flex-col lg:flex-row justify-items-center gap-8">
            {/* LEFT SIDE - CART ITEMS */}
            <div className="h-full flex-1 space-y-6 overflow-y-scroll">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6"
                >
                  {/* Product Image */}
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={`${API_URL}${item.image}`}
                      alt={item.title}
                      className="w-32 h-32 object-contain rounded-xl"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-center sm:text-start">
                        {item.title}
                      </h2>

                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1 text-center sm:text-start">
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.size && ` | Size: ${item.variant.size}`}
                        </p>
                      )}

                      <p className="mt-2 text-lg font-bold text-center sm:text-start">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-xl overflow-hidden w-fit">
                        <button
                          onClick={() => decreaseQty(index)}
                          className="px-4 py-2 hover:bg-gray-100 transition"
                        >
                          -
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(index)}
                          className="px-4 py-2 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="min-w-[300px] bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full bg-black text-white text-center py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
