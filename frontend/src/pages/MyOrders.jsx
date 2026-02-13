import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (order) => {
    if (order.isCancelled)
      return "bg-red-100 text-red-600";
    if (order.isDelivered)
      return "bg-green-100 text-green-600";
    if (order.isPaid)
      return "bg-blue-100 text-blue-600";
    return "bg-yellow-100 text-yellow-600";
  };

  const getStatusText = (order) => {
    if (order.isCancelled) return "Cancelled";
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Paid";
    return "Pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-10">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow text-center">
            <p className="text-gray-500 text-lg">
              You have no orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-semibold">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Date
                    </p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>
                    <p className="text-lg font-bold">
                      ₹{order.totalPrice}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order)}`}
                    >
                      {getStatusText(order)}
                    </span>
                  </div>
                </div>

                {/* PRODUCTS PREVIEW */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {order.orderItems?.slice(0, 5).map((item, index) => (
                    <div key={index} className="border rounded-xl p-3">
                      <img
                        src={`${API_URL}${item.image}`}
                        alt={item.name}
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-xs font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                {/* <div className="mt-6 flex justify-end">
                  <Link
                    to={`/order/${order._id}`}
                    className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                  >
                    View Details
                  </Link>
                </div> */}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
