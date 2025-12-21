import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { PackageCheck, Truck, Eye, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const statusColor = {
  PLACED: "text-orange-500",
  CONFIRMED: "text-indigo-500",
  PACKED: "text-blue-500",
  SHIPPED: "text-purple-500",
  OUT_FOR_DELIVERY: "text-emerald-500",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-500",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-32 text-slate-500">
        Loading your orders...
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-center mt-32 text-slate-500">
        You haven’t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Orders
        </h1>

        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              rounded-xl shadow
              p-5 space-y-4
            "
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Order id</p>
                <p className="font-semibold">#{order._id.slice(-6)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-bold text-emerald-600">
                  ₹{order.totalAmount}
                </p>
              </div>

              <div className={`font-semibold ${statusColor[order.orderStatus]}`}>
                {order.orderStatus.replaceAll("_", " ")}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="divide-y">
              {order.products.map((item, idx) => {
                const product = item.product;

                return (
                  <div key={idx} className="flex gap-4 py-4">
                    {/* IMAGE */}
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center rounded-md border bg-slate-100 dark:bg-slate-700">
                        <ImageOff className="text-slate-400" />
                      </div>
                    )}

                    {/* INFO */}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {product?.name || "Product unavailable"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-emerald-600">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-2">
              <Link
                to={`/order/${order._id}`}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
              >
                <Eye size={16} /> View Details
              </Link>

              {order.orderStatus !== "DELIVERED" && (
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Truck size={16} /> Tracking available soon
                </span>
              )}

              {order.orderStatus === "DELIVERED" && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <PackageCheck size={16} /> Delivered
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;

