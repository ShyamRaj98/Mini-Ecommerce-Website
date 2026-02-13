import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: Number,
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: String,
    description: String,
    specifications: String,
    price: {
      type: Number,
      required: true,
    },
    category: String,
    image: String,
    rating: {
      type: Number,
      default: 0,
    },
    variants: [variantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
