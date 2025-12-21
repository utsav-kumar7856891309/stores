import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  MapPin,
  LogOut,
  Package,
  Settings,
  CreditCard,
  Bell,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

const avatarOptions = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
];

const ProfilePage = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile: "",
    avatar: avatarOptions[0],
  });

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        avatar: user.avatar || avatarOptions[0],
      });
      if (user.address) setAddressForm(user.address);
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/profile", profileForm);
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const updateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/auth/address", addressForm);
      setUser(res.data);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update address");
    }
  };

  const updatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (passwordForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      await axios.put("/auth/change-password", passwordForm);
      toast.success("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update password");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-28">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please login to view profile</p>
          <Link to="/login" className="inline-block px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900 pt-28">
      <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl lg:grid-cols-4">
        
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="sticky p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700 top-28">
            
            {/* USER INFO */}
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={profileForm.avatar} 
                  alt="Avatar" 
                  className="object-cover w-16 h-16 border-2 border-blue-500 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back</p>
                <p className="font-semibold text-gray-900 truncate dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-600 truncate dark:text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* SIDEBAR NAVIGATION */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User size={18} />
                My Profile
              </button>

              <Link to="/my-orders">
                <button className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Package size={18} />
                  My Orders
                </button>
              </Link>

              <button
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "address"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <MapPin size={18} />
                Addresses
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "password"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Lock size={18} />
                Change Password
              </button>

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
          >
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={updateProfile}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Update your personal details</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="space-y-8">
                  {/* AVATAR SELECTION */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                    <div className="flex flex-wrap gap-4">
                      {avatarOptions.map((avatar) => (
                        <button
                          type="button"
                          key={avatar}
                          onClick={() => setProfileForm({ ...profileForm, avatar })}
                          className={`rounded-full p-1 transition-all ${
                            profileForm.avatar === avatar
                              ? "ring-2 ring-blue-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
                          }`}
                        >
                          <img
                            src={avatar}
                            alt="Avatar"
                            className="object-cover w-16 h-16 rounded-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PROFILE FIELDS */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg cursor-not-allowed dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <form onSubmit={updateAddress}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Update your shipping address</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Address
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      City *
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      State *
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </form>
            )}

            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Secure your account with a new password</p>
                </div>

                <div className="max-w-lg space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    onClick={updatePassword}
                    className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
