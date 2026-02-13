import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      brand,
      description,
      category,
      specifications,
      variants,
      primaryIndex,
    } = req.body;

    // Images from multer
    const images = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      isPrimary: Number(primaryIndex) === index,
    }));

    const parsedVariants = JSON.parse(variants);

    const product = await Product.create({
      title,
      brand,
      description,
      category,
      specifications: JSON.parse(specifications),
      variants: parsedVariants,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
