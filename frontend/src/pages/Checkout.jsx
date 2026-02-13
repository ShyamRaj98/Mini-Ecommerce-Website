import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, address, city, postalCode, country } = shipping;

    if (!user) {
      setError("You must be logged in to place an order.");
      return false;
    }

    if (!fullName || !address || !city || !postalCode || !country) {
      setError("Please fill all shipping fields.");
      return false;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return false;
    }

    setError("");
    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/orders", {
        orderItems: cartItems,
        shippingAddress: shipping,
        totalPrice,
      });

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Checkout
        </h1>

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SHIPPING FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "Postal Code", name: "postalCode" },
                { label: "Country", name: "country" },
              ].map((field) => (
                <div
                  key={field.name}
                  className={field.name === "fullName" || field.name === "address" || field.name === "country" ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={shipping[field.name]}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading || cartItems.length === 0}
              className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
