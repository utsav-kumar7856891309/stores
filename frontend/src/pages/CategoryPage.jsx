import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { 
  Filter, 
  IndianRupee, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  Star,
  Clock,
  TrendingUp,
  ArrowUpDown,
  Grid2X2,
  LayoutGrid,
  Check
} from "lucide-react";

const categories = [
  { name: "Electronics", slug: "electronics", icon: "⚡", color: "from-indigo-500 to-blue-500" },
  { name: "TVs & Appliances", slug: "tv", icon: "📺", color: "from-purple-500 to-pink-500" },
  { name: "AC", slug: "ac", icon: "❄️", color: "from-blue-500 to-cyan-500" },
  { name: "Coolers", slug: "coolers", icon: "💨", color: "from-teal-500 to-emerald-500" },
  { name: "Fans", slug: "fan", icon: "🌀", color: "from-cyan-500 to-sky-500" },
  { name: "Wires & Cables", slug: "wires & cables", icon: "🔌", color: "from-orange-500 to-amber-500" },
  { name: "Refrigerators", slug: "refrigerators", icon: "🧊", color: "from-yellow-500 to-orange-500" },
];

const sortOptions = [
  { value: "", label: "Recommended", icon: Sparkles },
  { value: "low-high", label: "Price: Low to High", icon: TrendingUp },
  { value: "high-low", label: "Price: High to Low", icon: TrendingUp },
  { value: "latest", label: "New Arrivals", icon: Clock },
  { value: "rating", label: "Top Rated", icon: Star },
];

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  const navigate = useNavigate();

  // FILTER STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  });

  useEffect(() => {
    if (category) {
      const formattedCategory = category
        .replace(/-/g, ' ')
        .toLowerCase();
      
      fetchProductsByCategory(formattedCategory);
    }
  }, [fetchProductsByCategory, category]);

  // Update price range when min/max changes
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // FILTER + SORT LOGIC
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Price filter
    data = data.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    // Sorting
    if (sort === "low-high") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      data.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sort === "latest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;
  }, [products, minPrice, maxPrice, sort]);

  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    if (type === 'min') {
      setMinPrice(Math.min(numValue, maxPrice));
    } else {
      setMaxPrice(Math.max(numValue, minPrice));
    }
  };

  // Handle dual range slider
  const handleRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    
    // Ensure min doesn't exceed max and vice versa
    if (index === 0) {
      newRange[0] = Math.min(newRange[0], priceRange[1]);
      setMinPrice(newRange[0]);
    } else {
      newRange[1] = Math.max(newRange[1], priceRange[0]);
      setMaxPrice(newRange[1]);
    }
    
    setPriceRange(newRange);
  };

  // Format price Indian style
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setPriceRange([0, 100000]);
    setSort("");
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = minPrice > 0 || maxPrice < 100000 || sort;
  const currentCategory = categories.find(cat => cat.slug === category);

  return (
    <div className="min-h-screen pt-28 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-blue-300 rounded-full top-1/4 left-1/4 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-purple-300 rounded-full bottom-1/4 right-1/4 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      <div className="flex gap-8 px-4 mx-auto max-w-7xl">
        
        {/* LEFT SIDEBAR - FILTERS (Desktop) */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden w-72 lg:block shrink-0"
        >
          <div className="sticky space-y-6 top-28">
            
            {/* FILTERS HEADER */}
            <div className="p-6 border border-gray-100 shadow-lg bg-linear-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl dark:border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-500">
                    <SlidersHorizontal size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                </div>
                
                {hasActiveFilters && (
                  <motion.button
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={clearFilters}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 transition-all duration-300 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>

              {/* Active Filters Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {minPrice > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                      Min: {formatPrice(minPrice)}
                      <button onClick={() => setMinPrice(0)} className="hover:text-green-600">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {maxPrice < 100000 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                      Max: {formatPrice(maxPrice)}
                      <button onClick={() => setMaxPrice(100000)} className="hover:text-blue-600">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {sort && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
                      {sortOptions.find(s => s.value === sort)?.label}
                      <button onClick={() => setSort("")} className="hover:text-purple-600">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CATEGORIES */}
            <div className="overflow-hidden border border-gray-100 shadow-lg bg-linear-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl dark:border-gray-700/50 backdrop-blur-sm">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500">
                    <Tag size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Categories
                  </h3>
                </div>
                {expandedSections.categories ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat.slug}
                          whileHover={{ x: 4 }}
                          onClick={() => navigate(`/category/${cat.slug}`)}
                          className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
                            category === cat.slug
                              ? `bg-linear-to-r ${cat.color} text-white shadow-lg`
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                          {category === cat.slug && (
                            <Check size={16} className="ml-auto" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PRICE RANGE */}
            <div className="overflow-hidden border border-gray-100 shadow-lg bg-linear-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl dark:border-gray-700/50 backdrop-blur-sm">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-r from-emerald-500 to-green-500">
                    <IndianRupee size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Price Range
                  </h3>
                </div>
                {expandedSections.price ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    {/* Dual Range Slider */}
                    <div className="relative h-2 mb-8">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      <div 
                        className="absolute top-0 h-1 rounded-full bg-linear-to-r from-blue-500 to-indigo-500"
                        style={{
                          left: `${(priceRange[0] / 100000) * 100}%`,
                          right: `${100 - (priceRange[1] / 100000) * 100}%`
                        }}
                      ></div>
                      
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={priceRange[0]}
                        onChange={(e) => handleRangeChange(0, e.target.value)}
                        className="absolute top-1/2 w-full h-2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                      />
                      
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => handleRangeChange(1, e.target.value)}
                        className="absolute top-1/2 w-full h-2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                      />
                    </div>

                    {/* Price Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Min</label>
                        <div className="relative">
                          <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                          <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={minPrice}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-xl outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max</label>
                        <div className="relative">
                          <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                          <input
                            type="number"
                            min={priceRange[0]}
                            max="100000"
                            value={maxPrice}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-xl outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Display */}
                    <div className="flex items-center justify-between p-4 mt-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(minPrice)}
                        </div>
                      </div>
                      <div className="w-6 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">To</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(maxPrice)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>

        {/* RIGHT CONTENT - PRODUCTS */}
        <div className="flex-1">
          {/* CATEGORY HEADER */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-8 mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                    <Sparkles size={14} className="text-white" />
                    <span className="text-sm font-semibold text-white">CATEGORY</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white md:text-5xl">
                    {currentCategory?.name || category?.replace(/-/g, ' ').replace(/and/g, '&') || "All Categories"}
                  </h1>
                  <p className="mt-3 text-lg text-gray-200">
                    Discover premium quality products for your needs
                  </p>
                </div>
                
                {currentCategory && (
                  <div className="flex items-center gap-4 p-4 border rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
                    <span className="text-3xl">{currentCategory.icon}</span>
                    <div>
                      <div className="text-sm text-gray-300">Showing</div>
                      <div className="text-2xl font-bold text-white">{filteredProducts.length} Products</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* TOP BAR - CONTROLS */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-start justify-between gap-4 p-6 mb-8 border border-gray-100 shadow-lg rounded-2xl bg-linear-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 dark:border-gray-700/50 backdrop-blur-sm md:flex-row md:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-700 dark:text-gray-300">
                <p className="font-medium">
                  Found <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">{filteredProducts.length}</span> of{" "}
                  <span className="font-bold">{products.length}</span> products
                </p>
              </div>
              
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-300 bg-blue-50 rounded-xl hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Clear Filters
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "grid" ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                  <Grid2X2 size={20} className={viewMode === "grid" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === "list" ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                  <LayoutGrid size={20} className={viewMode === "list" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 cursor-pointer rounded-xl dark:bg-gray-800">
                  <ArrowUpDown size={18} className="text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {sortOptions.find(s => s.value === sort)?.label || "Sort by"}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                
                <div className="absolute right-0 z-50 hidden w-64 mt-2 overflow-hidden bg-white border border-gray-200 shadow-2xl dark:bg-gray-800 rounded-xl group-hover:block dark:border-gray-700">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors duration-300 ${
                          sort === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{option.label}</span>
                        {sort === option.value && (
                          <Check size={16} className="ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Filters Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-3 font-medium text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 lg:hidden"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>
          </motion.div>

          {/* PRODUCTS GRID/LIST */}
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-16 text-center border border-gray-100 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl dark:border-gray-700/50 backdrop-blur-sm"
              >
                <div className="inline-flex p-4 mb-6 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <Sparkles size={32} className="text-gray-400" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                  No products found
                </h3>
                <p className="max-w-md mx-auto mb-8 text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or browse different categories to find what you're looking for
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="px-6 py-3 font-medium text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-700"
                  >
                    Clear All Filters
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/category/electronics')}
                    className="px-6 py-3 font-medium text-gray-700 transition-all duration-300 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Browse All
                  </motion.button>
                </div>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                layout
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    layout="grid"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                layout
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    layout="list"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count Footer */}
          {filteredProducts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 mt-12 text-center rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredProducts.length}</span> products • 
                Price range: <span className="font-bold">{formatPrice(minPrice)}</span> - <span className="font-bold">{formatPrice(maxPrice)}</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm p-6 overflow-y-auto bg-white dark:bg-gray-900 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Mobile filters content (same as desktop sidebar but vertical) */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Categories</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          navigate(`/category/${cat.slug}`);
                          setShowMobileFilters(false);
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                          category === cat.slug
                            ? `bg-linear-to-r ${cat.color} text-white shadow-lg`
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mb-2 text-2xl">{cat.icon}</span>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Price Range</h4>
                  <div className="space-y-4">
                    {/* Price inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                        <input
                          type="number"
                          placeholder="Min"
                          min="0"
                          max={maxPrice}
                          value={minPrice}
                          onChange={(e) => handlePriceChange('min', e.target.value)}
                          className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div className="relative">
                        <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                        <input
                          type="number"
                          placeholder="Max"
                          min={minPrice}
                          max="100000"
                          value={maxPrice}
                          onChange={(e) => handlePriceChange('max', e.target.value)}
                          className="w-full py-2.5 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Price display */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Min</div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(minPrice)}
                        </div>
                      </div>
                      <div className="w-6 h-px bg-gray-400"></div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Max</div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(maxPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Apply Filters Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;