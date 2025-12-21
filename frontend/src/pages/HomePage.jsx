import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import {
  Fan,
  Cable,
  Tv,
  ChevronLeft,
  ChevronRight,
  Monitor,
  ShoppingBag,
  Zap,
  Wind,
  Sparkles,
  Shield,
  Truck,
  Headphones,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

// Original slider images - tumhare local images
const sliderImages = [
  "/TV1.jpg",
  "/fan.jpg.webp",
  "/cable.jpg.jpg",
];

// Categories - Navbar ke same categories but AC and Coolers separate
const categories = [
  { name: "Electronics", icon: Monitor, slug: "electronics", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { name: "TVs & Appliances", icon: Tv, slug: "tv", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { name: "AC", icon: Zap, slug: "AC", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
  { name: "Coolers", icon: Wind, slug: "coolers", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { name: "Fans", icon: Fan, slug: "fan", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
  { name: "Wires & Cables", icon: Cable, slug: "wires", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { name: "Cables", icon: Cable, slug: "cables", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
];

// Featured banners slider
const featuredBanners = [
  {
    title: "Summer Sale",
    subtitle: "Upto 40% OFF on Coolers",
    image: "/cooler.jpg.webp",
    link: "/category/coolers"
  },
  {
    title: "Premium Quality",
    subtitle: "Industrial Grade Wires",
    image: "/cable.jpg.jpg",
    link: "/category/wires"
  },
  {
    title: "Energy Efficient",
    subtitle: "5-Star Rated Fans",
    image: "/fan.jpg.webp",
    link: "/category/fan"
  }
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const [slide, setSlide] = useState(0);
  const [bannerSlide, setBannerSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Auto slider for main banner
  useEffect(() => {
    if (!autoSlide) return;
    
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoSlide]);

  // Auto slider for featured banners
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % featuredBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const nextBannerSlide = () => {
    setBannerSlide((prev) => (prev + 1) % featuredBanners.length);
  };

  const prevBannerSlide = () => {
    setBannerSlide((prev) => (prev - 1 + featuredBanners.length) % featuredBanners.length);
  };

  return (
    <div className="min-h-screen pb-16 bg-white dark:bg-gray-900 pt-28">

      <section className="relative max-w-6xl px-4 mx-auto mb-12">
        <div 
          className="relative overflow-hidden shadow-lg h-80 md:h-96 rounded-xl"
          onMouseEnter={() => setAutoSlide(false)}
          onMouseLeave={() => setAutoSlide(true)}
        >
          {/* Main slider image */}
          <img
            src={sliderImages[slide]}
            className="object-cover w-full h-full transition-all duration-500"
            alt="banner"
          />
          
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
          
          {/* Slide indicator dots */}
          <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
            {sliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === slide 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-2.5 rounded-full text-white transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide text content */}
          <div className="absolute max-w-md text-white left-8 md:left-12 bottom-10 md:bottom-12">
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">
              Premium Electrical Products
            </h1>
            <p className="mb-4 text-sm md:text-base opacity-90">
              Quality wiring, cooling solutions, and home appliances
            </p>
            <Link
              to="/category/electronics"
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION - AC and Coolers separate */}
      <section className="px-4 py-10 mx-auto mb-12 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Browse our wide range of electrical products
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-3 p-4 transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow group dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700"
              >
                <div className={`w-14 h-14 ${cat.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={cat.color} />
                </div>
                <p className="text-xs font-medium leading-tight text-center text-gray-900 dark:text-white md:text-sm">
                  {cat.name}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* UPDATED FEATURES SECTION - Aapke diye gaye design ke hisaab se */}
      <section className="py-8 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <Truck size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Fast Delivery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Service available in multiple cities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/30">
                <Shield size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Quality Guarantee</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1-5 years warranty on products</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900/30">
                <CreditCard size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Easy Installation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional installation services</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4">
              <div className="p-3 bg-orange-100 rounded-lg dark:bg-orange-900/30">
                <Headphones size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expert customer support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS WITH BANNER SLIDER - Layout swapped */}
      <section className="px-4 py-10 mx-auto mb-16 max-w-7xl">
        
        {/* Featured Products Header with Featured badge centered */}
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                <div className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-linear-to-r from-emerald-500 to-green-500">
                  <Sparkles size={18} className="text-white" />
                  <span className="text-sm font-bold text-white">FEATURED</span>
                </div>
                <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Products
              </h2>
              <p className="max-w-xl mt-2 text-gray-600 dark:text-gray-300">
                Discover our premium selection of best-selling electrical products
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Left side - Banner Slider */}
          <div className="lg:w-1/3">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full min-h-[400px]">
              
              {/* Banner slider images */}
              <div className="relative h-full">
                <img
                  src={featuredBanners[bannerSlide].image}
                  className="object-cover w-full h-full transition-all duration-500"
                  alt={featuredBanners[bannerSlide].title}
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                
                {/* Banner content */}
                <div className="absolute text-white bottom-6 left-6 right-6">
                  <h3 className="mb-1 text-xl font-bold">
                    {featuredBanners[bannerSlide].title}
                  </h3>
                  <p className="mb-4 text-sm opacity-90">
                    {featuredBanners[bannerSlide].subtitle}
                  </p>
                  <Link
                    to={featuredBanners[bannerSlide].link}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-900 transition-colors bg-white rounded-lg hover:bg-gray-100"
                  >
                    Shop Now
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Banner navigation buttons */}
                <button
                  onClick={prevBannerSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-1.5 rounded-full text-white transition-all duration-300"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={nextBannerSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-1.5 rounded-full text-white transition-all duration-300"
                  aria-label="Next banner"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Banner indicator dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {featuredBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBannerSlide(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        idx === bannerSlide 
                          ? 'bg-white w-4' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to banner ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Featured Products */}
          <div className="lg:w-2/3">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="pb-4">
                <FeaturedProducts featuredProducts={products.slice(0, 6)} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Browse Products button */}
      <section className="max-w-4xl px-4 py-12 mx-auto">
        <div className="p-10 text-center text-white bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-2xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Explore Our Complete Collection
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Find the best electrical products for your home and office needs
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/category/electronics"
                className="inline-flex items-center gap-2 px-8 py-3 text-lg font-bold text-blue-600 transition-all duration-300 bg-white rounded-full hover:bg-gray-100 hover:scale-105"
              >
                <ShoppingBag size={20} />
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 text-lg font-bold transition-all duration-300 bg-transparent border-2 border-white rounded-full hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
