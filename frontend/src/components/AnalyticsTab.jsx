import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  BarChart3,
  Calendar,
  Download,
  Target,
  Activity,
  Shield,
  Sparkles
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// FIXED AnimatedCounter component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    
    return () => controls.stop();
  }, [value]);

  return (
    <span className="text-3xl font-bold">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// ALTERNATIVE SOLUTION - Simple Counter (No Framer Motion)
const SimpleAnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }
    
    const duration = 1500; // ms
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = (t) => t * (2 - t);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      setCount(Math.round(value * progress));
      
      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(value);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  return (
    <span className="text-3xl font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const AnalyticsCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <motion.div
    className="relative p-6 overflow-hidden shadow-xl rounded-2xl group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    {/* Gradient Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
    
    {/* Pattern Overlay */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute bottom-0 right-0 w-32 h-32 -mb-8 -mr-8 rounded-full bg-white/20" />
      <div className="absolute w-16 h-16 rounded-full right-10 bottom-10 bg-white/10" />
    </div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/90">{title}</p>
          <SimpleAnimatedCounter value={value} prefix={title.includes("Revenue") ? "₹" : ""} />
          {subtitle && (
            <p className="mt-2 text-xs text-white/70">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-300" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="ml-2 text-xs text-white/60">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    activeUsers: 0,
    refunds: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChart, setActiveChart] = useState("line");

  const fetchAnalyticsData = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const res = await axios.get(`/analytics?range=${timeRange}`);

      setAnalyticsData(res.data.analyticsData);
      setDailySalesData(res.data.dailySalesData);
      setCategoryData(res.data.categoryData || []);

      if (showToast) {
        toast.success("📊 Analytics updated successfully!");
      }
    } catch (err) {
      toast.error("❌ Failed to fetch analytics data");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleRefresh = () => {
    fetchAnalyticsData(true);
  };

  const exportAnalytics = () => {
    toast.success("📥 Exporting analytics data...");
    // Add export functionality here
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        {/* Skeleton Chart */}
        <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-4 mx-auto space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your store performance and insights in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users}
          icon={Users}
          color="from-indigo-500 to-violet-600"
          trend={12.5}
          subtitle={`${analyticsData.activeUsers} active now`}
        />
        
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products}
          icon={Package}
          color="from-emerald-500 to-teal-600"
          trend={8.2}
          subtitle="Across all categories"
        />
        
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales}
          icon={ShoppingCart}
          color="from-cyan-500 to-blue-600"
          trend={15.3}
          subtitle={`₹${analyticsData.avgOrderValue?.toLocaleString()} avg. order`}
        />
        
        <AnalyticsCard
          title="Total Revenue"
          value={analyticsData.totalRevenue}
          icon={DollarSign}
          color="from-orange-500 to-amber-600"
          trend={22.7}
          subtitle="Net revenue after taxes"
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Chart Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Sales & Revenue Trends
            </h2>
            
            {/* Chart Type Selector */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {["line", "area", "bar"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveChart(type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    activeChart === type
                      ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {type === "line" && "Trend"}
                  {type === "area" && "Area"}
                  {type === "bar" && "Bar"}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 p-1 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            {["week", "month", "quarter", "year"].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${
                  timeRange === range
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <motion.div
          key={`${activeChart}-${timeRange}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800 rounded-2xl"
        >
          <ResponsiveContainer width="100%" height={400}>
            {activeChart === "line" ? (
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales Count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive
                  animationDuration={1500}
                />
              </LineChart>
            ) : activeChart === "area" ? (
              <AreaChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8B5CF6"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  animationDuration={1500}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  animationDuration={1500}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800 rounded-2xl"
            >
              <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
                Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Sales']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Top Performing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800 rounded-2xl"
            >
              <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
                Top Performing Metrics
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Best Sales Day</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {dailySalesData.reduce((max, day) => day.sales > max.sales ? day : max, dailySalesData[0])?.name}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Highest Revenue</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ₹{dailySalesData.reduce((max, day) => day.revenue > max.revenue ? day : max, dailySalesData[0])?.revenue?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Avg. Daily Sales</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {(dailySalesData.reduce((sum, day) => sum + day.sales, 0) / dailySalesData.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;