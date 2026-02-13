import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🔥 Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/products", {
          params: {
            search: debouncedSearch,
            category,
            sort,
            page,
          },
        });

        setProducts(data.products);
        setTotalPages(data.totalPages);

        // unique categories
        const uniqueCategories = [
          ...new Set(data.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories);

        setError("");
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, category, sort, page]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-black text-white py-2 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Search Product
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* FILTER SECTION */}
        <div className="bg-white shadow-md rounded-3xl p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search products..."
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* CATEGORY */}
            <select
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* SORT */}
            <select
              className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="newest">Newest</option>
              <option value="priceLowHigh">Price: Low → High</option>
              <option value="priceHighLow">Price: High → Low</option>
            </select>

            {/* CLEAR */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
                setPage(1);
              }}
              className="bg-black text-white rounded-xl hover:bg-gray-800 transition py-3"
            >
              Reset Filters
            </button>

          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white h-80 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 flex-wrap">
                {[...Array(totalPages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={`px-4 py-2 rounded-xl border transition ${
                      page === x + 1
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
