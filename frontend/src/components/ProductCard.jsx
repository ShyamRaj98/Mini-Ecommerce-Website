import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full shadow">
          {product.category}
        </span>

        {/* Wishlist Icon */}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description || "Premium quality product for daily use."}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-bold text-black">
            ₹{product.price}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>

        {/* View Details */}
        <Link
          to={`/product/${product._id}`}
          className="block mt-3 text-center border border-black py-2 rounded-xl font-medium hover:bg-black hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
