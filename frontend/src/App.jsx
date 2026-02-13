import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import OrderSuccess from "./pages/OrderSuccess";
import AddProduct from "./pages/Admin/AddProduct";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/Admin/AllOrders";
import AllProductList from "./pages/Admin/AllProductList";
import EditProduct from "./pages/Admin/EditProduct";
import AdminLayout from "../src/layout/AdminLayout";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC LAYOUT ================= */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </>
        }
      />

      {/* ================= ADMIN LAYOUT ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<AllProductList />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<AllOrders />} />
      </Route>

    </Routes>
  );
}

export default App;
