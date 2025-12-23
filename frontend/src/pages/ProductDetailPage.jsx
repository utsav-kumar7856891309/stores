import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  ChevronLeft, 
  Heart, 
  Share2, 
  ArrowRight,
  Check,
  Headphones,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, selectedProduct } = useProductStore();
  const { addToCart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = [
    selectedProduct.image,
    // "https://via.placeholder.com/600x600/374151/ffffff?text=Product+View+2",
    // "https://via.placeholder.com/600x600/374151/ffffff?text=Product+View+3",
    // "https://via.placeholder.com/600x600/374151/ffffff?text=Product+View+4"
  ];

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    addToCart(selectedProduct);
    // toast.success(`Added to cart!`);
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    await clearCart();
    await addToCart(selectedProduct);
    navigate("/cart?autoCheckout=true");
  };

  return (
    <div className="min-h-screen pb-16 pt-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Back Button */}
      <div className="px-4 mx-auto mb-6 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>
      </div>

      <div className="px-4 mx-auto max-w-7xl">
        {/* Main Product Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-2"
        >
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative p-8 overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <img
                src={images[selectedImage]}
                alt={selectedProduct.name}
                className="w-full h-auto max-h-[480px] object-contain transition-transform duration-500 hover:scale-105"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                  BEST SELLER
                </span>
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute p-3 transition-all rounded-full shadow-lg top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-110"
              >
                <Heart 
                  size={20} 
                  className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"} 
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-4 pb-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? "border-blue-500 shadow-lg scale-105" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${index + 1}`} 
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Product Description Section (features की जगह) */}
            <div className="p-6 border border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Product Description
              </h3>
              <div className="space-y-4">
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  {selectedProduct.description || "This premium product combines cutting-edge technology with elegant design. Engineered for exceptional performance and durability, it offers a seamless user experience with intuitive controls and reliable operation."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-white">
                {selectedProduct.name}
              </h1>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <Zap size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Premium Electronic Product
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="flex items-end gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Inclusive of all taxes • Free shipping
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center flex-1 gap-3 px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="flex items-center justify-center flex-1 gap-3 px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl"
              >
                <ArrowRight size={20} />
                Buy Now
              </motion.button>
              
              <button className="p-4 transition-colors border-2 border-gray-300 rounded-xl dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600">
                <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Stock Status */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Available</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    In Stock - Ready to Ship 
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-6 space-y-4 border border-gray-200 rounded-2xl dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Truck size={20} />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="font-medium text-gray-900 dark:text-white">2-3 Business Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Free Shipping</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Installation</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          {/* Tab Content */}
          <div className="p-8 rounded-b-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {activeTab === "description" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Key Features</h3>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Discover the advanced features that make this product stand out from the competition.
                </p>
                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Specifications</h4>
                    <ul className="space-y-2">
                      {["Energy Efficient", "Premium Build Quality", "Easy Installation", "Smart Control Compatible"].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check size={16} className="text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">What's in the Box</h4>
                    <ul className="space-y-2">
                      {["Main Product", "User Manual", "Installation Guide", "Warranty Card", "Accessories Kit"].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Package size={16} className="text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;