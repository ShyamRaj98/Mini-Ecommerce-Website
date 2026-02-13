import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/products?page=${page}&keyword=${keyword}&category=${category}`
      );
      setProducts(data.products);
      setPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, keyword, category]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search */}
      <input
        placeholder="Search..."
        className="border p-2 mr-2"
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Category */}
      <select
        className="border p-2"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All</option>
        <option value="shoes">Shoes</option>
        <option value="mobile">Mobile</option>
      </select>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x}
            className={`px-3 py-1 border ${
              page === x + 1 && "bg-black text-white"
            }`}
            onClick={() => setPage(x + 1)}
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
}


function AddToCartButton({ product, selectedVariant }) {
  const { addToCart } = useContext(CartContext);

  const handleAdd = () => {
    if (!selectedVariant) {
      alert("Select variant");
      return;
    }

    addToCart({
      productId: product._id,
      title: product.title,
      image:
        product.images.find((i) => i.isPrimary)?.url ||
        product.images[0]?.url,
      variant: selectedVariant.attributes,
      price: selectedVariant.price,
      qty: 1,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-black text-white px-6 py-2 mt-4"
    >
      Add To Cart
    </button>
  );
}
