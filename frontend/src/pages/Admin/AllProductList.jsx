import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AllProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🔐 Admin Protection
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products/admin/products");
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setActionLoading(id);

      // Optimistic UI
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));

      await api.delete(`/products/admin/products/${id}`);
    } catch (error) {
      setError("Failed to delete product.");
      fetchProducts();
    } finally {
      setActionLoading(null);
    }
  };

  const toggleStatus = async (product) => {
    try {
      setActionLoading(product._id);

      // Optimistic update
      const updatedProducts = products.map((p) =>
        p._id === product._id
          ? { ...p, isActive: !p.isActive }
          : p
      );

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);

      await api.put(`/products/admin/products/${product._id}`, {
        isActive: !product.isActive,
      });
    } catch (error) {
      setError("Failed to update product.");
      fetchProducts();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Products</h2>

          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Product
          </button>
        </div>

        {/* 🔎 Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-10">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No products found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3">Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3">
                      {product.image && (
                        <img
                          src={`${API_URL}${product.image}`}
                          alt={product.title}
                          className="h-14 w-14 object-cover rounded-lg"
                        />
                      )}
                    </td>

                    <td className="font-medium">
                      {product.title}
                    </td>

                    <td className="font-semibold">
                      ₹{product.price}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        Edit
                      </button>

                      <button
                        disabled={actionLoading === product._id}
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs disabled:opacity-50"
                      >
                        {actionLoading === product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                      <button
                        disabled={actionLoading === product._id}
                        onClick={() => toggleStatus(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs disabled:opacity-50"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
