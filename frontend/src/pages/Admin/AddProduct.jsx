import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    specifications: "",
    price: "",
    category: "",
  });

  const [variants, setVariants] = useState([
    { color: "", size: "", stock: "" },
  ]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔐 Admin Protection
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Cleanup image preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    updated[index][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", size: "", stock: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title || !formData.price) {
      setError("Title and Price are required.");
      return false;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return false;
    }

    for (let variant of variants) {
      if (!variant.color || !variant.size || variant.stock === "") {
        setError("All variant fields must be filled.");
        return false;
      }

      if (Number(variant.stock) < 0) {
        setError("Stock cannot be negative.");
        return false;
      }
    }

    if (!image) {
      setError("Product image is required.");
      return false;
    }

    setError("");
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) =>
        data.append(key, formData[key])
      );

      data.append("variants", JSON.stringify(variants));
      data.append("image", image);

      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">
          Add Product
        </h1>

        {error && (
          <div className="mb-6 bg-red-100 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Product Title"
              required
              onChange={handleChange}
              className="border rounded-lg p-3"
            />
            <input
              name="brand"
              placeholder="Brand"
              onChange={handleChange}
              className="border rounded-lg p-3"
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            name="specifications"
            placeholder="Specifications"
            rows="3"
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              placeholder="Price"
              required
              onChange={handleChange}
              className="border rounded-lg p-3"
            />
            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
              className="border rounded-lg p-3"
            />
          </div>

          {/* Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Product Variants
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Variant
              </button>
            </div>

            {variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
              >
                <input
                  name="color"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  className="border rounded-lg p-2"
                />
                <input
                  name="size"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  className="border rounded-lg p-2"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  className="border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="bg-red-500 text-white rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="w-full border rounded-lg p-3 border-dashed"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-40 rounded-lg object-cover"
              />
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg text-lg disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
