import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import dummyProfile from "../assets/dummy-profile.png";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const [profileImagePath, setProfileImagePath] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setProfileImagePath(data.profileImage || "");
      } catch (err) {
        console.log("Failed to load profile .");
      }
    };

    fetchProfile();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const displayCount = cartCount > 99 ? "99+" : cartCount;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const profileImage =
  user?.profileImage
    ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.profileImage}`
    : dummyProfile;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="backdrop-blur-md bg-black/80 text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-widest hover:opacity-80 transition"
        >
          FITZDO
        </Link>

        <div className="flex items-center gap-8 relative">
          {/* <Link to="/" className="hover:text-gray-300 transition">
            Products
          </Link> */}

          {/* 🛒 Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                {displayCount}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="relative cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={(e) => (e.target.src = dummyProfile)}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white hover:scale-105 transition"
                />

                {/* Admin Badge */}
                {user.isAdmin && (
                  <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] px-1 rounded-full font-bold">
                    ADMIN
                  </span>
                )}
              </div>

              {open && (
                <div className="absolute right-0 mt-4 w-56 bg-white text-black rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-5 py-3 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-5 py-3 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    My Orders
                  </Link>

                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-5 py-3 hover:bg-gray-100 transition"
                      onClick={() => setOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
