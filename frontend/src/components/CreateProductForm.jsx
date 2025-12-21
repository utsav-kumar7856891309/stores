import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, ImageIcon, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";


const categories = [
  "electronics",
  "tv", 
  "AC",
  "coolers",
  "fan",
  "wires & cables",
  "Refrigerator",
  

];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "10", 
  });

  const { createProduct, loading, error } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submitting product:", newProduct);

    if (!newProduct.image) {
      alert("Please upload an image");
      return;
    }

    if (!newProduct.category) {
      alert("Please select a category");
      return;
    }

    // Price validate karo
    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      await createProduct({
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: price,
        category: newProduct.category,
        image: newProduct.image,
        stock: parseInt(newProduct.stock) || 10,
      });

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "10",
      });

      alert("Product created successfully!");
      
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Please check console for details.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { 
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNewProduct(prev => ({ ...prev, image: "" }));
  };

  // Category display names
  const getCategoryDisplayName = (slug) => {
    const categoryMap = {
      "electronics": "Electronics",
      "tv": "TVs & Appliances", 
      "AC": "AC",
      "coolers": "Coolers",
      "fan": "Fans",
      "wires": "Wires & Cables",
      "Refrigerator": "Refrigerators",
    };
    return categoryMap[slug] || slug;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl p-8 mx-auto bg-white border shadow-xl dark:bg-gray-800 dark:border-gray-700 rounded-2xl"
    >
      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full dark:bg-blue-900/30">
          <PlusCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Product
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new product to your store inventory
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PRODUCT NAME */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Name *
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, name: e.target.value }))
            }
            required
            className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Description *
          </label>
          <textarea
            placeholder="Enter detailed product description"
            rows={4}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct((p) => ({ ...p, description: e.target.value }))
            }
            required
            className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg outline-none resize-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* PRICE, CATEGORY & STOCK */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Price (₹) *
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, price: e.target.value }))
              }
              required
              className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Category *
            </label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, category: e.target.value }))
              }
              required
              className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {getCategoryDisplayName(c)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="10"
              min="0"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct((p) => ({ ...p, stock: e.target.value }))
              }
              className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Image *
          </label>
          
          {!newProduct.image ? (
            <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500">
              <label className="flex flex-col items-center gap-2 text-gray-500 transition-colors cursor-pointer dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <div className="p-3 bg-gray-100 rounded-full dark:bg-gray-700">
                  <Upload size={24} />
                </div>
                <span className="font-medium">Upload Product Image</span>
                <span className="text-sm">PNG, JPG, JPEG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative">
              <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image Preview
                  </span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                <img
                  src={newProduct.image}
                  alt="Preview"
                  className="object-cover w-full h-48 rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full gap-3 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Creating Product...
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              Create Product
            </>
          )}
        </motion.button>
        <div className="p-3 text-xs text-gray-500 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <strong>Debug Info:</strong> Categories: {categories.join(", ")}
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;

