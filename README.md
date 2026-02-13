# 🛒 MERN E-Commerce Platform

A full-stack E-Commerce web application built using the **MERN Stack (MongoDB, Express, React, Node.js)**.

This project includes user shopping functionality and a complete admin panel for managing products and orders.

---


## 🚀 Features

### 👤 User Features
- User Registration & Login (JWT Authentication)
- Browse Products
- Product Details Page
- Add to Cart
- Update Cart Quantity
- Place Orders
- View Order Status

### 🛠️ Admin Features
- Add / Edit / Delete Products
- Manage Product Variants (Size, Color, Stock)
- Upload Product Images
- Activate / Deactivate Products
- View All Orders
- Mark Orders as Paid
- Admin Dashboard

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (Image Upload)

---

## 📂 Project Structure

```
ecommerce/
│
├── client/          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── api/
│
├── server/          # Express Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── uploads/
│
└── README.md
```

---

## Demo Link
```bash
https://fitzdoz.netlify.app
```
## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ShyamRaj98/Mini-Ecommerce-Website.git
cd your-repo-name
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env` file inside `client` folder:

```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected admin routes
- Role-based access control (User / Admin)

---

## 🛒 Cart System

- Add product to cart
- Increase / decrease quantity
- Remove item from cart
- Dynamic cart count in header
- Backend persistent cart

---

## 🧩 Product Variant Structure

Example:

```js
variants: [
  {
    size: "M",
    color: "Black",
    stock: 10
  }
]
```

Each variant contains:
- Size
- Color
- Available Stock

---

## 📦 Order Flow

1. User adds product to cart
2. User places order
3. Order saved to database
4. Admin views all orders
5. Admin marks order as Paid

---

## 🔄 API Endpoints Overview

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
```

### Products
```
GET    /api/products
POST   /api/products/admin/products
PUT    /api/products/admin/products/:id
DELETE /api/products/admin/products/:id
```

### Cart
```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
```

### Orders
```
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id/pay
```

---

## 📊 Admin Panel Pages

- Dashboard
- Manage Products
- Add Product
- Edit Product
- Manage Orders

---

## 🌍 Deployment

### Backend
- Render
- Railway
- AWS EC2

### Frontend
- Vercel
- Netlify

---

## 🧪 Future Improvements

- Online Payment Integration (Stripe / Razorpay)
- Order Status Tracking (Shipped, Delivered)
- Product Search & Filter
- Pagination
- Wishlist Feature
- Reviews & Ratings
- Admin Analytics Dashboard

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Your Name  
Shyam Raj
