import Product from "../models/Product.js";


  // Add Product (Admin Only)
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      brand,
      description,
      specifications,
      price,
      category,
      variants,
    } = req.body;

    const product = new Product({
      title,
      brand,
      description,
      specifications,
      price,
      category,
      variants: variants ? JSON.parse(variants) : [],
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // Get All Products (Public)

export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const keyword = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const query = {
      isActive: true, // Only active products visible to users
      ...keyword,
      ...categoryFilter,
    };

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // Get Single Product (Public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product && product.isActive) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // Get All Products (Admin)

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      brand,
      description,
      specifications,
      price,
      category,
      variants,
      isActive,
    } = req.body;

    product.title = title ?? product.title;
    product.brand = brand ?? product.brand;
    product.description = description ?? product.description;
    product.specifications = specifications ?? product.specifications;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.isActive = isActive ?? product.isActive;

    if (variants) {
      product.variants = JSON.parse(variants);
    }

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================
   ❌ Delete Product (Admin)
========================================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
