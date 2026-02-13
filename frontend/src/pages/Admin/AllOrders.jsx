import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AllOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsPaid = async (id) => {
    try {
      setUpdatingId(id);

      await api.put(
        `/orders/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      await fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Payment update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (!user) {
    return (
      <div className="p-8 text-center text-red-500">
        Please login as admin to view orders.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No orders found
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-xl p-5 hover:shadow-md transition bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold text-lg">
                      {order.user?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 text-xs rounded-full font-semibold ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">
                    Total: ₹{order.totalPrice}
                  </p>

                  {!order.isPaid && (
                    <button
                      onClick={() => markAsPaid(order._id)}
                      disabled={updatingId === order._id}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {updatingId === order._id
                        ? "Updating..."
                        : "Mark as Paid"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
