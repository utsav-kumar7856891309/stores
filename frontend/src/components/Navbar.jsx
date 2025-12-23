import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Lock,
  Search,
  User,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  Package,
  Settings,
  LogOut,
  Monitor,
  Tv,
  Zap,
  Wind,
  Fan,
  Cable,
  Refrigerator,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

/* =======================
   CATEGORY DATA
======================= */
const categories = [
  { name: "Electronics", icon: Monitor, slug: "electronics", color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900/30" },
  { name: "TVs & Appliances", icon: Tv, slug: "tv", color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  { name: "AC", icon: Zap, slug: "ac", color: "text-teal-500", bgColor: "bg-teal-100 dark:bg-teal-900/30" },
  { name: "Coolers", icon: Wind, slug: "coolers", color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { name: "Fans", icon: Fan, slug: "fan", color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-900/30" },
  { name: "Wires & Cables", icon: Cable, slug: "wires & cables", color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  { name: "Refrigerators", icon: Refrigerator, slug: "refrigerators", color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
];

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const menuRef = useRef(null);

  /* =======================
     STATE VARIABLES
  ======================= */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  /* =======================
     EFFECTS
  ======================= */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =======================
     HANDLERS
  ======================= */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  /* =======================
     COMPONENT RENDER
  ======================= */
  return (
    <header 
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" 
          : "bg-white dark:bg-gray-900 shadow-md"
      }`}
    >
      {/* =======================
          TOP BAR
      ======================= */}
      <div className="flex items-center h-16 gap-4 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <ShoppingBag className="text-blue-600 dark:text-blue-400" size={28} />
          <div>
            Electronic
            <span className="text-blue-600 dark:text-blue-400">Items</span>
          </div>
        </Link>

        {/* SEARCH - DESKTOP */}
        <div className="flex-1 hidden max-w-2xl mx-6 lg:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-lg outline-none dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <Search 
              className="absolute left-4 top-3.5 text-gray-400" 
              size={20} 
            />
            <button 
              type="submit"
              className="absolute right-3 top-2.5 text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Search
            </button>
          </form>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-2 ml-auto">
          {/* SEARCH - MOBILE */}
          <button 
            onClick={() => navigate("/search")}
            className="p-2 rounded-full lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Search size={20} />
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* NOTIFICATIONS */}
          {user && (
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
            </button>
          )}

          {/* CART */}
          {user && (
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {cart.length > 9 ? "9+" : cart.length}
                </span>
              )}
            </Link>
          )}

          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="items-center hidden gap-2 px-3 py-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 sm:flex"
            >
              <Lock size={16} />
              <span className="text-sm font-medium">Admin</span>
            </Link>
          )}

          {/* USER MENU */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="hidden text-sm font-medium sm:block">{user.name}</span>
                <ChevronDown size={14} className="hidden sm:block" />
              </button>

              {/* DROPDOWN MENU */}
              <div
                className={`
                  absolute right-0 w-56 mt-2 bg-white border shadow-2xl
                  dark:bg-gray-800 dark:border-gray-700 rounded-xl transition-all duration-200
                  ${menuOpen 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-2"
                  }
                `}
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={16} /> 
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Package size={16} /> 
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings size={16} /> 
                    <span>Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/secret-dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Lock size={16} /> 
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-3 py-2.5 mt-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} /> 
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 sm:block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300
          ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`
            absolute top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl 
            transform transition-transform duration-300
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
            <h2 className="text-xl font-bold">Menu</h2>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-center text-white bg-blue-600 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-4 py-3 text-center text-blue-600 border-2 border-blue-600 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {user && (
              <div className="p-4 mb-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-500">Categories</h3>
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Icon size={18} className={c.color} />
                    <span>{c.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {user && (
              <div className="pt-4 border-t dark:border-gray-800">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/secret-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Lock size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-3 py-2.5 mt-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORIES BAR */}
      <div className={`border-t bg-gray-50 dark:bg-gray-800 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="items-center hidden h-12 gap-6 px-6 mx-auto overflow-x-auto lg:flex max-w-7xl">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <NavLink
                key={c.slug}
                to={`/category/${c.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? `${c.bgColor} ${c.color} font-semibold`
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                <Icon size={18} className={c.color} />
                <span className="text-sm font-medium">{c.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;