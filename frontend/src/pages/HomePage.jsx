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
  RefrigeratorIcon,
  ArrowRight,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  BatteryCharging,
} from "lucide-react";
import { Link } from "react-router-dom";

const sliderImages = [
  "/ac.jpg.webp",
  "/fan.jpg.webp",
  "/cable.jpg.jpg",
];

const categories = [
  { name: "Electronics", icon: Monitor, slug: "electronics", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", gradient: "from-indigo-400 to-blue-500" },
  { name: "TVs & Appliances", icon: Tv, slug: "tv", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", gradient: "from-purple-400 to-pink-500" },
  { name: "AC", icon: Zap, slug: "ac", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", gradient: "from-teal-400 to-cyan-500" },
  { name: "Coolers", icon: Wind, slug: "coolers", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", gradient: "from-blue-400 to-sky-500" },
  { name: "Fans", icon: Fan, slug: "fan", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20", gradient: "from-cyan-400 to-emerald-500" },
  { name: "Wires & Cables", icon: Cable, slug: "wires & cables", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", gradient: "from-orange-400 to-red-500" },
  { name: "Refrigerators", icon: RefrigeratorIcon, slug: "refrigerators", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", gradient: "from-yellow-400 to-amber-500" },
];

const featuredBanners = [
  {
    title: "Summer Sale",
    subtitle: "Upto 40% OFF on Coolers",
    image: "/cooler.jpg.webp",
    link: "/category/coolers",
    badge: "HOT DEAL"
  },
  {
    title: "Premium Quality",
    subtitle: "Industrial Grade Wires",
    image: "/cable.jpg.jpg",
    link: "/category/wires",
    badge: "PREMIUM"
  },
  {
    title: "Energy Efficient",
    subtitle: "5-Star Rated Fans",
    image: "/fan.jpg.webp",
    link: "/category/fan",
    badge: "ENERGY SAVER"
  }
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const [slide, setSlide] = useState(0);
  const [bannerSlide, setBannerSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
    setMounted(true);
  }, [fetchFeaturedProducts]);

  useEffect(() => {
    if (!autoSlide) return;
    
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoSlide]);

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
    <div className="min-h-screen pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-28">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-purple-300 rounded-full top-1/4 left-10 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute delay-1000 bg-blue-300 rounded-full bottom-1/4 right-10 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
        <div className="absolute w-64 h-64 delay-500 bg-teal-300 rounded-full top-3/4 left-1/3 mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse"></div>
      </div>

      {/* Hero Slider Section */}
      <section className="relative px-4 mx-auto mb-16 max-w-7xl">
        <div className="relative">
          {/* Glass Morphism Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-3xl blur-3xl"></div>
          
          <div 
            className="relative overflow-hidden rounded-2xl shadow-2xl h-[500px] backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/50"
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          >
            {/* Main slider with parallax effect */}
            <div className="absolute inset-0">
              <img
                src={sliderImages[slide]}
                className={`object-cover w-full h-full transition-all duration-1000 ${mounted ? 'scale-100' : 'scale-110'}`}
                alt="banner"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            {/* Content Container */}
            <div className="relative z-10 flex items-center h-full">
              <div className="max-w-2xl pl-12 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                  <Sparkles size={14} />
                  <span>TRENDING NOW</span>
                </div>
                
                {/* Title with gradient */}
                <h1 className="text-5xl font-bold leading-tight text-white">
                  Premium Electrical
                  <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                    Products
                  </span>
                </h1>
                
                {/* Description */}
                <p className="max-w-lg text-lg text-gray-200">
                  Discover quality wiring, efficient cooling solutions, and modern home appliances with exclusive deals
                </p>
                
                {/* CTA Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link
                    to="/category/electronics"
                    className="relative inline-flex items-center gap-3 px-8 py-4 font-semibold text-white transition-all duration-300 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl hover:scale-105 hover:shadow-2xl"
                  >
                    <ShoppingBag size={20} />
                    <span>Shop Now</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></div>
                  </Link>
                  
                  <Link
                    to="/products"
                    className="px-8 py-4 font-semibold text-white transition-all duration-300 border-2 group border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm hover:border-white/50"
                  >
                    <span className="relative">
                      View All
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Slide Navigation Dots */}
            <div className="absolute flex gap-3 -translate-x-1/2 bottom-8 left-1/2">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlide(idx)}
                  className={`relative w-12 h-2 rounded-full overflow-hidden transition-all duration-300 ${
                    idx === slide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ${
                    idx === slide ? 'w-full' : 'w-0'
                  }`}></div>
                </button>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute p-4 text-white transition-all duration-300 -translate-y-1/2 border rounded-full left-6 top-1/2 group bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute p-4 text-white transition-all duration-300 -translate-y-1/2 border rounded-full right-6 top-1/2 group bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-110 border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="relative px-4 py-12 mx-auto mb-16 max-w-7xl">
        <div className="relative z-10 mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-4 border border-blue-100 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">CATEGORIES</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Shop by <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">Category</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Browse our comprehensive range of electrical products for every need
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="relative p-6 overflow-hidden transition-all duration-500 border border-gray-100 group rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 hover:scale-105 hover:shadow-2xl hover:border-transparent"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${cat.gradient} transition-opacity duration-500 -z-10`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-5">
                  <div className={`absolute inset-0 ${cat.bg} rounded-2xl group-hover:scale-110 transition-transform duration-500`}></div>
                  <div className="relative flex items-center justify-center w-16 h-16 mx-auto">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${cat.gradient} shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
                      <Icon size={28} className="text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Category Name */}
                <h3 className="text-sm font-semibold text-center text-gray-900 transition-colors duration-300 dark:text-white group-hover:text-white">
                  {cat.name}
                </h3>
                
                {/* Hover arrow */}
                <div className="absolute transition-all duration-300 translate-x-2 opacity-0 bottom-4 right-4 group-hover:opacity-100 group-hover:translate-x-0">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section - Glass Morphism */}
      <section className="relative px-4 py-16 mx-auto mb-16 max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>
        
        <div className="relative p-8 border shadow-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 rounded-3xl border-white/20 dark:border-gray-700/50">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Truck size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Fast Delivery</h4>
              <p className="text-gray-600 dark:text-gray-300">Same-day delivery in metro cities</p>
              <div className="mt-4 text-sm text-blue-600 transition-opacity duration-300 opacity-0 dark:text-blue-400 group-hover:opacity-100">
                <CheckCircle size={14} className="inline mr-1" />
                Service available
              </div>
            </div>
            
            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Quality Guarantee</h4>
              <p className="text-gray-600 dark:text-gray-300">1-5 years warranty on all products</p>
              <div className="mt-4 text-sm text-green-600 transition-opacity duration-300 opacity-0 dark:text-green-400 group-hover:opacity-100">
                <Award size={14} className="inline mr-1" />
                Certified quality
              </div>
            </div>
            
            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <CreditCard size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Easy Installation</h4>
              <p className="text-gray-600 dark:text-gray-300">Professional setup services included</p>
              <div className="mt-4 text-sm text-purple-600 transition-opacity duration-300 opacity-0 dark:text-purple-400 group-hover:opacity-100">
                <Clock size={14} className="inline mr-1" />
                24/7 support
              </div>
            </div>
            
            <div className="p-6 transition-all duration-300 border border-gray-100 group rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xl">
              <div className="inline-flex p-3 mb-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <Headphones size={24} className="text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">24/7 Support</h4>
              <p className="text-gray-600 dark:text-gray-300">Expert customer support team</p>
              <div className="mt-4 text-sm text-orange-600 transition-opacity duration-300 opacity-0 dark:text-orange-400 group-hover:opacity-100">
                <BatteryCharging size={14} className="inline mr-1" />
                Always available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products with Banner Section */}
      <section className="relative px-4 py-16 mx-auto mb-16 max-w-7xl">
        <div className="relative z-10 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-4 text-white rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
            <Sparkles size={16} />
            <span className="text-sm font-bold">FEATURED PRODUCTS</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Premium <span className="text-transparent bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text">Selection</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Discover our handpicked collection of best-selling electrical products
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Banner Slider */}
          <div className="lg:w-2/5">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-full min-h-[500px] group">
              {/* Banner Image */}
              <div className="absolute inset-0">
                <img
                  src={featuredBanners[bannerSlide].image}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  alt={featuredBanners[bannerSlide].title}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              
              {/* Banner Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border rounded-full bg-white/20 backdrop-blur-sm border-white/30 w-fit">
                  <TrendingUp size={14} className="text-white" />
                  <span className="text-sm font-semibold text-white">{featuredBanners[bannerSlide].badge}</span>
                </div>
                
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {featuredBanners[bannerSlide].title}
                </h3>
                <p className="mb-6 text-lg text-gray-200">
                  {featuredBanners[bannerSlide].subtitle}
                </p>
                
                <Link
                  to={featuredBanners[bannerSlide].link}
                  className="relative inline-flex items-center gap-3 px-6 py-3 font-semibold text-gray-900 transition-all duration-300 bg-white group hover:bg-gray-100 rounded-xl w-fit"
                >
                  <span>Explore Now</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              {/* Navigation Dots */}
              <div className="absolute flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
                {featuredBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBannerSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === bannerSlide 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to banner ${idx + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevBannerSlide}
                className="absolute p-3 text-white transition-all duration-300 -translate-y-1/2 border rounded-full left-4 top-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-white/20"
                aria-label="Previous banner"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={nextBannerSlide}
                className="absolute p-3 text-white transition-all duration-300 -translate-y-1/2 border rounded-full right-4 top-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-white/20"
                aria-label="Next banner"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Featured Products Grid */}
          <div className="lg:w-3/5">
            <div className="relative p-6 border shadow-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 rounded-3xl border-white/20 dark:border-gray-700/50">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="pb-4">
                  <FeaturedProducts featuredProducts={products.slice(0, 6)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative max-w-6xl px-4 py-16 mx-auto">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Content */}
          <div className="relative z-10 px-8 py-16 text-center md:px-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
              <Star size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">LIMITED TIME OFFER</span>
            </div>
            
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Upgrade Your Space with
              <span className="block mt-2">Premium Electrical Solutions</span>
            </h2>
            
            <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-200">
              From smart appliances to energy-efficient solutions, find everything you need for modern living
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/products"
                className="relative px-10 py-4 overflow-hidden text-lg font-bold text-gray-900 transition-all duration-300 bg-white group hover:text-gray-800 rounded-xl hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Browse All Products</span>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white to-gray-100 group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 transition-transform duration-500 origin-left transform scale-x-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:scale-x-100"></div>
              </Link>
              
              <Link
                to="/contact"
                className="px-10 py-4 text-lg font-bold text-white transition-all duration-300 border-2 group border-white/40 rounded-xl hover:bg-white/10 backdrop-blur-sm hover:border-white/70"
              >
                <span className="relative">
                  Get Expert Advice
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;