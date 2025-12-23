import {
  BarChart,
  PlusCircle,
  ShoppingBasket,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Home,
  Shield,
  TrendingUp,
  Sparkles,
  Menu,
  X,
  Zap,
  Package,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminOrdersTab from "../components/AdminOrdersTab";
import AdminProfileMenu from "../components/AdminProfileMenu";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const menu = [
  { 
    id: "create", 
    label: "Create Product", 
    icon: PlusCircle,
    color: "from-emerald-500 to-green-500",
    description: "Add new products to your store"
  },
  { 
    id: "products", 
    label: "Products", 
    icon: ShoppingBasket,
    color: "from-blue-500 to-cyan-500",
    description: "Manage your product inventory"
  },
  { 
    id: "orders", 
    label: "Orders", 
    icon: ClipboardList,
    color: "from-purple-500 to-pink-500",
    description: "View and manage customer orders"
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    icon: BarChart,
    color: "from-orange-500 to-amber-500",
    description: "Track store performance and insights"
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });
  const { fetchAllProducts, products } = useProductStore();
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
    
    // Simulate fetching stats
    setStats({
      products: products.length,
      orders: 42, // This would come from API
      revenue: 125000,
      users: 156,
    });
  }, [fetchAllProducts, products.length]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
  };

  const getActiveTab = () => menu.find(m => m.id === activeTab);

  return (
    <div className="flex h-screen overflow-hidden text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 dark:text-white">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: mobileSidebarOpen ? 0 : (sidebarOpen ? 0 : -300),
          width: sidebarOpen ? 280 : 0
        }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 z-50 flex-col hidden h-screen overflow-hidden border-r border-gray-200 md:flex md:sticky bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl dark:border-gray-800"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text">
                  Admin Panel
                </h2>
<p className="text-xs font-medium text-gray-600 dark:text-gray-400">
  Welcome, {user?.name || "Admin"}
</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
<div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 w-fit">
  <Package className="w-4 h-4 text-indigo-500" />
  <p className="text-xs text-gray-600 dark:text-gray-400">
    Manage products, orders, and inventory from here
  </p>
</div>

        {/* Menu */}
        <nav className="flex flex-col flex-1 gap-1 p-4 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group relative flex items-center gap-3
                  px-4 py-3.5 rounded-xl transition-all duration-300
                  ${active 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <Icon
                    size={20}
                    className={active ? "text-white" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
                  />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="font-medium text-left">{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute w-2 h-2 -translate-y-1/2 bg-white rounded-full right-3 top-1/2"
                      />
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800"
          >
            <div className="space-y-2">
              <button
                onClick={() => navigate("/")}
                className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <Home size={20} />
                <span>Back to Store</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-colors dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-200 w-72 dark:bg-gray-900 dark:border-gray-800 md:hidden"
          >
            {/* Mobile Sidebar Content */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your store
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl w-full mb-2
                      ${active 
                        ? `bg-gradient-to-r ${item.color} text-white` 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 px-6 py-4 border-b border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:flex"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="flex items-center gap-3 text-2xl font-bold">
                  {getActiveTab()?.label}
                  {getActiveTab()?.id === "analytics" && (
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  )}
                  {getActiveTab()?.id === "create" && (
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  )}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getActiveTab()?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
             
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800 rounded-2xl"
            >
              {/* Content Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getActiveTab()?.label}
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {getActiveTab()?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {activeTab === "create" && <CreateProductForm />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "orders" && <AdminOrdersTab />}
                {activeTab === "analytics" && <AnalyticsTab />}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 mt-6 border border-gray-200 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-gray-800 rounded-xl"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Admin Dashboard v2.0
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div className="flex items-center gap-4">
                
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Zap size={16} />
                  Performance
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;