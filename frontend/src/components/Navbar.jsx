// import React, { useEffect, useState } from "react";
// import {
//   ShoppingCart,
//   UserPlus,
//   Lock,
//   Search,
//   User,
//   ChevronDown,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserStore } from "../stores/useUserStore";
// import { useCartStore } from "../stores/useCartStore";

// const categories = [
//   { name: "Electronics", slug: "electronics" },
//   { name: "TVs & Appliances", slug: "tv" },
//   { name: "AC", slug: "AC" },
//   { name: "Coolers", slug: "coolers" },
//   { name: "Fans", slug: "fan" },
//   { name: "Wires & Cables", slug: "wires" },
//   { name: "Cables", slug: "cables" },
// ];

// const Navbar = () => {
//   const { user, logout } = useUserStore();
//   const { cart } = useCartStore();
//   const isAdmin = user?.role === "admin";
//   const navigate = useNavigate();

//   /* 🌙 THEME STATE */
//   const [theme, setTheme] = useState(
//     localStorage.getItem("theme") || "light"
//   );

//   /* APPLY THEME */
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light");
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-white text-black dark:bg-slate-900 dark:text-white shadow">
      
//       {/* TOP BAR */}
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

//         {/* LOGO */}
//         <Link to="/" className="text-xl font-bold tracking-wide">
//           Electronic<span className="text-indigo-500">Items</span>
//         </Link>

//         {/* SEARCH */}
//         <div className="flex-1 max-w-xl flex bg-gray-100 dark:bg-slate-800 rounded-md overflow-hidden">
//           <input
//             placeholder="Search for products, brands and more"
//             className="w-full px-4 py-2 text-sm bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
//           />
//           <button className="px-4 text-indigo-500 hover:text-indigo-400">
//             <Search size={18} />
//           </button>
//         </div>

//         {/* NAV */}
//         <nav className="flex items-center gap-6 text-sm">

//           {/* 🌙 THEME TOGGLE */}
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-800 transition"
//             title="Toggle theme"
//           >
//             {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
//           </button>

//           {/* USER MENU */}
//           {user ? (
//             <div className="relative group">

//               <div className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-800 transition">
//                 <User size={18} />
//                 <span className="font-medium">{user.name}</span>
//                 <ChevronDown size={14} />
//               </div>

//               <div className="absolute left-0 right-0 top-full h-3" />

//               <div
//                 className="
//                   absolute right-0 top-[calc(100%+6px)]
//                   w-56
//                   bg-white dark:bg-slate-800
//                   border border-gray-200 dark:border-slate-700
//                   rounded-xl shadow-xl
//                   opacity-0 invisible translate-y-2
//                   group-hover:opacity-100
//                   group-hover:visible
//                   group-hover:translate-y-0
//                   transition-all duration-200
//                 "
//               >
//                 <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-xl">
//                   Profile
//                 </Link>

//                 <Link to="/profile?tab=orders" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700">
//                   My Orders
//                 </Link>

//                 <div className="h-px bg-gray-200 dark:bg-slate-700 my-1" />

//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-b-xl"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition"
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/signup"
//                 className="flex items-center gap-1 hover:text-indigo-500 transition"
//               >
//                 <UserPlus size={16} /> Sign Up
//               </Link>
//             </>
//           )}

//           {/* CART */}
//           {user && (
//             <Link to="/cart" className="relative flex items-center gap-1 hover:text-indigo-500 transition">
//               <ShoppingCart size={18} />
//               Cart
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-indigo-500 text-xs px-1.5 rounded-full text-white">
//                   {cart.length}
//                 </span>
//               )}
//             </Link>
//           )}

//           {/* ADMIN */}
//           {isAdmin && (
//             <Link
//               to="/secret-dashboard"
//               className="flex items-center gap-1 bg-indigo-500 text-white px-2 py-1 rounded"
//             >
//               <Lock size={14} /> Admin
//             </Link>
//           )}
//         </nav>
//       </div>

//       {/* CATEGORY BAR */}
//       <div className="bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
//         <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-8 text-sm">
//           {categories.map((c) => (
//             <Link
//               key={c.slug}
//               to={`/category/${c.slug}`}
//               className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition"
//             >
//               {c.name}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  UserPlus,
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
} from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "TVs & Appliances", slug: "tv" },
  { name: "AC", slug: "AC" },
  { name: "Coolers", slug: "coolers" },
  { name: "Fans", slug: "fan" },
  { name: "Wires & Cables", slug: "wires" },
  { name: "Cables", slug: "cables" },
];

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  // THEME SETUP - Simple aur effective
  const [theme, setTheme] = useState(() => {
    // Pehle localStorage check karo
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    
    // System preference check karo
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
  });

  // THEME APPLY KARO - 100% WORKING METHOD
  useEffect(() => {
    const html = document.documentElement;
    
    // Pehle purane classes hatao
    html.classList.remove("light", "dark");
    
    // Naya class add karo
    html.classList.add(theme);
    
    // Data attribute bhi set karo (optional)
    html.setAttribute("data-theme", theme);
    
    // LocalStorage mein save karo
    localStorage.setItem("theme", theme);
    
    // Debugging ke liye
    console.log("🔄 Theme applied:", theme);
  }, [theme]);

  // THEME TOGGLE FUNCTION
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log("🌙 Theme toggled to:", newTheme);
      return newTheme;
    });
  };

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full text-gray-800 bg-white shadow-md dark:bg-gray-900 dark:text-gray-100">
      
      {/* TOP BAR */}
      <div className="flex items-center h-16 gap-4 px-6 mx-auto max-w-7xl">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Electronic<span className="text-blue-600 dark:text-blue-400">Items</span>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex flex-1 max-w-2xl overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-800">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none dark:placeholder-gray-400 dark:text-white"
          />
          <button className="px-5 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            <Search size={20} />
          </button>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-3 ml-4">

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={22} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun size={22} className="text-yellow-500" />
            )}
          </button>

          {/* NOTIFICATION BELL */}
          {user && (
            <button className="relative p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>
          )}

          {/* CART ICON */}
          {user && (
            <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* ADMIN BUTTON (Separate from dropdown) */}
          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="flex items-center gap-2 px-4 py-2 ml-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Lock size={18} />
              <span className="font-medium">Admin</span>
            </Link>
          )}

          {/* USER PROFILE DROPDOWN */}
          {user ? (
            <div className="relative ml-2 group">
              
              {/* PROFILE BUTTON */}
              <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900">
                  <User size={18} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <ChevronDown size={16} className="ml-2" />
              </button>

              {/* DROPDOWN MENU */}
              <div className="absolute right-0 z-50 invisible w-64 mt-1 transition-all duration-200 bg-white border border-gray-200 shadow-2xl opacity-0 top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl group-hover:opacity-100 group-hover:visible">
                
                {/* USER INFO CARD */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                      Administrator
                    </span>
                  )}
                </div>

                {/* MENU ITEMS */}
                <div className="p-2">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  
                  <Link to="/my-orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Package size={18} />
                    <span>My Orders</span>
                  </Link>

                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>

                  {/* LOGOUT BUTTON */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LOGIN/SIGNUP BUTTONS */
            <div className="flex items-center gap-3 ml-2">
              <Link
                to="/login"
                className="px-5 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
              
              <Link
                to="/signup"
                className="px-5 py-2.5 font-medium text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORIES BAR */}
      <div className="border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between h-12 px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-8">
            
      {categories.map((c) => (
  <NavLink
    key={c.slug}
    to={`/category/${c.slug}`}
    className={({ isActive }) =>
      `font-medium whitespace-nowrap transition-colors pb-2
      ${
        isActive
          ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      }`
    }
  >
    {c.name}
  </NavLink>
))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
