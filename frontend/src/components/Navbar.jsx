import React, { useEffect, useState } from "react";
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
} from "lucide-react";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

/* =======================
   CATEGORY DATA
======================= */
const categories = [
  { name: "Electronics", icon: Monitor, slug: "electronics", color: "text-indigo-500" },
  { name: "TVs & Appliances", icon: Tv, slug: "tv", color: "text-purple-500" },
  { name: "AC", icon: Zap, slug: "ac", color: "text-teal-500" },
  { name: "Coolers", icon: Wind, slug: "coolers", color: "text-blue-500" },
  { name: "Fans", icon: Fan, slug: "fans", color: "text-cyan-500" },
  { name: "Wires & Cables", icon: Cable, slug: "wires-cables", color: "text-orange-500" },
  { name: "Refrigerators", icon: Refrigerator, slug: "refrigerators", color: "text-yellow-500" },
];

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  /* =======================
     THEME STATE
  ======================= */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  /* =======================
     USER MENU STATE
  ======================= */
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md dark:bg-gray-900 dark:text-gray-100">
      {/* =======================
          TOP BAR
      ======================= */}
      <div className="flex items-center h-16 gap-4 px-6 mx-auto max-w-7xl">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          Electronic
          <span className="text-blue-600 dark:text-blue-400">Items</span>
        </Link>

        {/* SEARCH */}
        <div className="flex flex-1 max-w-2xl overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800">
          <input
            placeholder="Search for products, brands and more"
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
          />
          <button className="px-5 text-white bg-blue-600 hover:bg-blue-700">
            <Search size={18} />
          </button>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* NOTIFICATIONS */}
          {user && (
            <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}

          {/* CART */}
          {user && (
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1.5">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-lg"
            >
              <Lock size={16} />
              Admin
            </Link>
          )}

          {/* USER MENU */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <User size={18} />
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  absolute right-0 w-56 mt-2 bg-white border shadow-xl
                  dark:bg-gray-800 rounded-xl transition-all
                  ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
              >
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={16} /> Profile
                </Link>

                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Package size={16} /> Orders
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={16} /> Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border-2 border-blue-600 rounded-lg text-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

     
      <div className="border-t bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-8 px-6 mx-auto max-w-7xl h-12">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <NavLink
                key={c.slug}
                to={`/category/${c.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 pb-1 font-medium transition
                  ${
                    isActive
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
                  }`
                }
              >
                <Icon size={16} className={c.color} />
                {c.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

