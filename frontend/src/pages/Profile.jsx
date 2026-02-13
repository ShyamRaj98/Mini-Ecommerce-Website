import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import dummyProfile from "../../src/assets/dummy-profile.png";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Separate states (IMPORTANT FIX)
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePath, setProfileImagePath] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto hide success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");

        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });

        setProfileImagePath(data.profileImage || "");
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setProfileImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("address", formData.address);

      if (profileImageFile) {
        form.append("profileImage", profileImageFile);
      }

      const { data } = await api.put("/auth/profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update context + localStorage
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      // Update image path
      setProfileImagePath(data.profileImage);
      setPreviewImage(null);
      setProfileImageFile(null);

      setSuccess("Profile updated successfully 🎉");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  const imageUrl =
    previewImage ||
    (profileImagePath
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${profileImagePath}`
      : dummyProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Profile
        </h1>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-gray-200 shadow-md transition-transform duration-300 group-hover:scale-105"
              />

              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium rounded-full cursor-pointer transition">
                Change
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Address
              </label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
