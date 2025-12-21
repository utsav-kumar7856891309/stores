import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { Filter, IndianRupee } from "lucide-react";


const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "TVs & Appliances", slug: "tv" },
  { name: "AC", slug: "AC" },
  { name: "Coolers", slug: "coolers" },
  { name: "Fans", slug: "fan" },
  { name: "Wires & Cables", slug: "wires & cables" },
  { name: "Refrigerators", slug: "refrigerators" },
];

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  const navigate = useNavigate();

  // FILTER STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (category) {
      // URL slug ko backend ke compatible format mein convert karo
      const formattedCategory = category
        .replace(/-/g, ' ')
        .toLowerCase();
      
      fetchProductsByCategory(formattedCategory);
    }
  }, [fetchProductsByCategory, category]);

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
    if (type === 'min') {
      setMinPrice(Number(value));
    } else {
      setMaxPrice(Number(value));
    }
  };

  // Price range slider change
  const handleRangeChange = (e) => {
    setMaxPrice(Number(e.target.value));
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
    setSort("");
  };

  const hasActiveFilters = minPrice > 0 || maxPrice < 100000 || sort;

  return (
    <div className="min-h-screen pt-28 bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-8 px-4 mx-auto max-w-7xl">
        
        {/* LEFT SIDEBAR - FILTERS */}
        <aside className="hidden w-64 lg:block shrink-0">
          <div className="sticky space-y-8 top-28">
            
            {/* FILTERS HEADER */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filters
                </h3>
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="p-4 bg-white border rounded-lg dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Categories
              </h3>
              <select
  value={category || ""}
  className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2.5 rounded-lg
    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  onChange={(e) => {
    if (e.target.value) {
      navigate(`/category/${e.target.value}`);
    }
  }}
>
  <option value="">All Categories</option>
  {categories.map((cat) => (
    <option key={cat.slug} value={cat.slug}>
      {cat.name}
    </option>
  ))}
</select>

            </div>

            {/* BY PRICE RANGE - Pahle wala design */}
            <div className="p-4 bg-white border rounded-lg dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                By Price
              </h3>

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={maxPrice}
                onChange={handleRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
 
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-center">
                  <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(minPrice)}
                    </span>
                  </div>
                  <span className="block mt-1 text-gray-600 dark:text-gray-400">Min. Price</span>
                </div>
                
                <div className="text-center">
                  <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(maxPrice)}
                    </span>
                  </div>
                  <span className="block mt-1 text-gray-600 dark:text-gray-400">Max. Price</span>
                </div>
              </div>

              {/* Min/Max Inputs - Additional controls */}
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full py-2 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-9 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="relative flex-1">
                  <IndianRupee className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
                  <input
                    type="number"
                    placeholder="Max"
                    min={minPrice}
                    max="100000"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full py-2 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none pl-9 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT - PRODUCTS */}
        <div className="flex-1">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 capitalize dark:text-white">
              {category ? category.replace(/-/g, ' ').replace(/and/g, '&') : "All Categories"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              High-quality electronics and appliances for your home
            </p>
          </div>

          {/* TOP BAR - SORTING & RESULTS */}
          <div className="flex flex-col items-start justify-between gap-4 p-4 mb-8 bg-white border rounded-lg md:flex-row md:items-center dark:bg-gray-800">
            <div className="text-gray-700 dark:text-gray-300">
              <p className="font-medium">
                Showing <span className="font-bold text-blue-600">{filteredProducts.length}</span> of{" "}
                <span className="font-bold">{products.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="latest">New Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* MOBILE FILTERS BUTTON */}
          <div className="mb-6 lg:hidden">
            <button
              className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => {
                // Mobile filters modal implement karna hoga
                console.log("Open mobile filters");
              }}
            >
              <Filter size={20} />
              Filters & Sort
            </button>
          </div>

          {/* PRODUCTS GRID */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white border rounded-lg dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or browse different categories
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;