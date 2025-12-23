import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  Upload, 
  Loader, 
  X, 
  Tag, 
  Package, 
  DollarSign, 
  Hash, 
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  TrendingUp,
  Shield
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  { id: "electronics", name: "Electronics", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { id: "tv", name: "TVs & Appliances", icon: "📺", color: "from-purple-500 to-pink-500" },
  { id: "ac", name: "Air Conditioners", icon: "❄️", color: "from-cyan-500 to-blue-500" },
  { id: "coolers", name: "Coolers", icon: "🌀", color: "from-green-500 to-emerald-500" },
  { id: "fan", name: "Fans", icon: "💨", color: "from-sky-500 to-blue-500" },
  { id: "wires & cables", name: "Wires & Cables", icon: "🔌", color: "from-orange-500 to-red-500" },
  { id: "refrigerators", name: "Refrigerators", icon: "🧊", color: "from-indigo-500 to-purple-500" },
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

  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createProduct, loading, error } = useProductStore();
  
  // File input reference
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProduct.image) {
      alert("Please upload an image");
      return;
    }

    if (!newProduct.category) {
      alert("Please select a category");
      return;
    }

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await createProduct({
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: price,
        category: newProduct.category,
        image: newProduct.image,
        stock: parseInt(newProduct.stock) || 10,
      });

      clearInterval(interval);
      setUploadProgress(100);
      
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "10",
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Please check console for details.");
      clearInterval(interval);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  // Function to trigger file input click
  const handleBrowseFilesClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setNewProduct(prev => ({ ...prev, image: "" }));
  };

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-4xl px-4 mx-auto">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed z-50 transform -translate-x-1/2 top-6 left-1/2"
            >
              <div className="flex items-center gap-3 px-6 py-4 text-white shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Product Created Successfully!</p>
                  <p className="text-sm opacity-90">Your product is now live in the store</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="overflow-hidden border shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/20 dark:border-gray-700/30 rounded-3xl"
        >
          {/* Form Header */}
          <div className="relative p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Create New Product
                  </h1>
                  <p className="mt-2 text-blue-100">
                    Add amazing products to your digital store
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <LayoutGrid className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Product Details</span>
                </div>
                <div className="w-8 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Upload Media</span>
                </div>
                <div className="w-8 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-white/90">Category</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 mb-8 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800/30 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Error Creating Product</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Product Name & Description */}
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Name
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-5 py-4 text-gray-900 transition-all duration-300 border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Description
                  </label>
                </div>
                <textarea
                  placeholder="Describe your product in detail..."
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  required
                  className="w-full px-5 py-4 text-gray-900 transition-all duration-300 border border-gray-200 shadow-sm resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price, Category & Stock */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30">
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Price (₹)</label>
                </div>
                <div className="relative">
                  <span className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))}
                    required
                    className="w-full pl-10 pr-5 py-3.5 text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/30">
                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Category</label>
                </div>
                <div className="relative">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                    required
                    className="w-full px-5 py-3.5 appearance-none text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                  >
                    <option value="" className="text-gray-500">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-gray-900 dark:text-white">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                    <LayoutGrid className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/30 dark:to-blue-800/30">
                    <Hash className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <label className="font-medium text-gray-900 dark:text-white">Stock</label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                  className="w-full px-5 py-3.5 text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Category Selection Grid */}
            {!newProduct.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8"
              >
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Select Category
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewProduct(p => ({ ...p, category: cat.id }))}
                      className="p-4 transition-all duration-300 bg-white border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 dark:bg-gray-800 group"
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3`}>
                        {cat.icon}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Selected Category Display */}
            {newProduct.category && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Selected Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setNewProduct(p => ({ ...p, category: "" }))}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Change
                  </button>
                </div>
                {(() => {
                  const cat = getCategoryById(newProduct.category);
                  return cat ? (
                    <div className="flex items-center gap-4 p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 rounded-2xl">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl`}>
                        {cat.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">All products in this category</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </motion.div>
            )}

            {/* Image Upload */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/30 dark:to-rose-800/30 rounded-xl">
                  <Image className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Product Image
                </label>
              </div>

              {!newProduct.image ? (
                <div className="p-12 text-center transition-all duration-300 border-gray-300 border-dashed border-3 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30">
                    <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Drag & Drop or Click to Upload
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                    <button
                      type="button"
                      onClick={handleBrowseFilesClick}
                      className="inline-flex items-center gap-2 px-6 py-3 mt-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700"
                    >
                      Browse Files
                    </button>
                  </div>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-700"
                >
                  <div className="absolute z-10 top-4 right-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={removeImage}
                      className="p-3 text-white shadow-lg bg-gradient-to-br from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Image Preview</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click remove to change image</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="object-cover w-full h-64 shadow-lg rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Section */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 rounded-xl">
                    <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Secure & Verified</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your data is protected with encryption</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setNewProduct({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      image: "",
                      stock: "10",
                    })}
                    className="px-8 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Reset Form
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="relative px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    <div className="absolute inset-0 w-full h-full transition-transform duration-500 translate-y-full bg-gradient-to-r from-blue-700 to-indigo-700 group-hover:translate-y-0" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Creating Product...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          <span>Publish Product</span>
                          <TrendingUp className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProductForm;