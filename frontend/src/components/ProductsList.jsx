import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit2, Eye, Package, IndianRupee, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductSkeleton from "./ProductSkeleton";
import AdminProductFilters from "./AdminProductFilters";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { products, isLoading, deleteProduct } = useProductStore();
  const [search, setSearch] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchMin = min ? p.price >= Number(min) : true;
    const matchMax = max ? p.price <= Number(max) : true;
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchName && matchMin && matchMax && matchCategory;
  });

  const handleDelete = (id, name) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-5 border border-gray-200 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 rounded-2xl w-80"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Delete Product?</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
          </div>
        </div>
        
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
          This action cannot be undone. All product data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setDeletingId(id);
                await deleteProduct(id);
                toast.success("✅ Product deleted successfully");
              } catch {
                toast.error("❌ Failed to delete product");
              } finally {
                setDeletingId(null);
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    ));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const getStockColor = (stock) => {
    if (stock > 20) return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    if (stock > 5) return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";
    return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      tv: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      ac: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      coolers: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      fan: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      "wires & cables": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      refrigerators: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };
    return colors[category] || "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Filters */}
      <AdminProductFilters
        search={search}
        setSearch={setSearch}
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Total Products</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="p-4 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 dark:border-green-800/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400">Filtered Products</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">{filtered.length}</p>
            </div>
            <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="p-4 border bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 border-amber-200 dark:border-amber-800/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-400">Average Price</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                ₹{products.length > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0}
              </p>
            </div>
            <IndianRupee className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        
        <div className="p-4 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 dark:border-purple-800/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                {products.filter(p => p.stock < 10).length}
              </p>
            </div>
            <Hash className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence>
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center col-span-full"
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                No products found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            filtered.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden transition-all duration-300 border border-gray-200 shadow-lg group bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 rounded-2xl hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(p.category)}`}>
                    {p.category}
                  </div>
                  
                  {/* Stock Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStockColor(p.stock)}`}>
                    Stock: {p.stock}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {p.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {p.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {p.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 transition-colors rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        title="Edit product"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={deletingId === p._id}
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-2 text-red-600 transition-colors rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete product"
                      >
                        {deletingId === p._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-t from-blue-500/10 to-transparent group-hover:opacity-100" />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductsList;