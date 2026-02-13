import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { ShoppingCart, MinusIcon, Plus } from "lucide-react";
import Loader from "../components/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        if (data.variants?.length > 0) {
          const first = data.variants[0];
          setSelectedColor(first.color);
          setSelectedSize(first.size);
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const colors = useMemo(() => {
    return [...new Set(product?.variants?.map((v) => v.color))];
  }, [product]);


  const sizes = useMemo(() => {
    return product?.variants
      ?.filter((v) => v.color === selectedColor)
      .map((v) => v.size);
  }, [product, selectedColor]);

  // Selected Variant
  const selectedVariant = useMemo(() => {
    return product?.variants?.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Reset quantity if variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedColor, selectedSize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* IMAGE SECTION */}
        <div className="bg-white rounded-3xl shadow-lg p-8 overflow-hidden group">
          <img
            src={`${API_URL}${product.image}`}
            alt={product.title}
            className="w-full h-[450px] object-contain transform group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h1 className="text-4xl font-bold text-gray-900">
            {product.title}
          </h1>

          <p className="text-gray-500 mt-2">{product.brand}</p>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-black">
              ₹{product.price}
            </span>

            {product.oldPrice && (
              <span className="text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>
            )}
          </div>

          {/* COLOR */}
          {colors?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">
                Color: <span className="text-gray-600">{selectedColor}</span>
              </h3>

              <div className="flex gap-3 flex-wrap">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                    }}
                    className={`px-5 py-2 rounded-full border transition ${
                      selectedColor === color
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE */}
          {sizes?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">
                Size: {selectedSize || "Select size"}
              </h3>

              <div className="flex gap-3 flex-wrap">
                {sizes.map((size, index) => {
                  const variant = product.variants.find(
                    (v) => v.color === selectedColor && v.size === size
                  );

                  const outOfStock = variant?.stock === 0;

                  return (
                    <button
                      key={index}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-full border transition ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "hover:bg-gray-100"
                      } ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STOCK */}
          {selectedVariant && (
            <p
              className={`mt-6 font-semibold ${
                selectedVariant.stock > 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {selectedVariant.stock > 0
                ? `In Stock (${selectedVariant.stock})`
                : "Out of Stock"}
            </p>
          )}

          {/* QUANTITY */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              className="w-10 h-10 rounded-xl border hover:bg-gray-100 flex justify-center items-center"
            >
              <MinusIcon />
            </button>

            <span className="text-xl font-semibold">{quantity}</span>

            <button
              onClick={() =>
                selectedVariant &&
                setQuantity((q) =>
                  Math.min(selectedVariant.stock, q + 1)
                )
              }
              className="w-10 h-10 rounded-xl border hover:bg-gray-100 flex justify-center items-center"
            >
              <Plus />
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={() =>
              addToCart(product, selectedVariant, quantity)
            }
            className="w-full mt-10 flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl hover:bg-gray-800 transition text-lg font-semibold disabled:opacity-50"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
