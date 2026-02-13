import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetchLoading(true);
        const { data } = await api.get(`/products/${id}`);

        setFormData({
          title: data.title || "",
          brand: data.brand || "",
          description: data.description || "",
          specifications: data.specifications || "",
          price: data.price || "",
          category: data.category || "",
        });

        setVariants(
          data.variants?.length
            ? data.variants
            : [{ color: "", size: "", stock: "" }]
        );

        if (data.image) {
          setPreview(`${API_URL}${data.image}`);
        }
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Cleanup preview memory
  useEffect(() => {
    return () => {
      if (preview && image) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, image]);

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

      if (image) {
        data.append("image", image);
      }

      await api.put(
        `/products/admin/products/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">
          Edit Product
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
              value={formData.title}
              onChange={handleChange}
              className="border rounded-lg p-3"
              placeholder="Product Title"
            />
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="border rounded-lg p-3"
              placeholder="Brand"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg p-3"
            placeholder="Description"
          />

          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg p-3"
            placeholder="Specifications"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="border rounded-lg p-3"
              placeholder="Price"
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded-lg p-3"
              placeholder="Category"
            />
          </div>

          {/* Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Variants
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
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  placeholder="Color"
                  className="border rounded-lg p-2"
                />
                <input
                  name="size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  placeholder="Size"
                  className="border rounded-lg p-2"
                />
                <input
                  name="stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, e)
                  }
                  placeholder="Stock"
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

          {/* Image */}
          <div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-40 rounded-lg mb-4 object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
