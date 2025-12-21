import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  ImageOff,
} from "lucide-react";

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];
const statusColor = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40";
    case "CANCELLED":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/40";
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40";
    case "PACKED":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800";
  }
};
const statusSelectStyle = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-300";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-300";
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-indigo-50 text-indigo-700 border-indigo-300";
    case "PACKED":
      return "bg-sky-50 text-sky-700 border-sky-300";
    default:
      return "bg-slate-50 text-slate-700 border-slate-300";
  }
};
const refundUI = {
  NONE: {
    label: "Request Refund",
    icon: RotateCcw,
    color:
      "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800",
  },
  REQUESTED: {
    label: "Refund Requested",
    icon: Clock,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40",
  },
  APPROVED: {
    label: "Refunded",
    icon: CheckCircle,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40",
  },
  REJECTED: {
    label: "Refund Rejected",
    icon: XCircle,
    color:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40",
  },
};

const normalizeRefundStatus = (status) =>
  refundUI[status] ? status : "NONE";

const AdminOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setActionId(id);
      await axios.put(`/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: status } : o
        )
      );

      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error("Failed to update order");
    } finally {
      setActionId(null);
    }
  };

  const refundOrder = async (id) => {
    try {
      setActionId(id);
      await axios.post(`/orders/${id}/refund`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, refundStatus: "REQUESTED" }
            : o
        )
      );

      toast.success("Refund request sent");
    } catch {
      toast.error("Refund failed");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <p className="text-slate-500">Loading orders…</p>;
  if (!orders.length) return <p className="text-slate-500">No orders found</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const refundStatus = normalizeRefundStatus(order.refundStatus);
        const RefundIcon = refundUI[refundStatus].icon;
        const products = order.products || [];

        return (
          <div
            key={order._id}
            className="
              p-6 rounded-2xl
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              shadow-sm hover:shadow-md
              transition-all duration-200
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order._id.slice(-6)}
                </p>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 text-xs rounded-full ${statusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <p className="text-xl font-bold text-emerald-600">
                ₹{order.totalAmount}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {order.user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{order.user?.name}</p>
                <p className="text-xs text-slate-500">
                  {order.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {products.slice(0, 3).map((item, idx) => {
                const img = item.product?.image;

                return img ? (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="
                      w-12 h-12 rounded-lg
                      object-cover
                      border border-slate-200
                      bg-white
                    "
                  />
                ) : (
                  <div
                    key={idx}
                    className="
                      w-12 h-12
                      flex items-center justify-center
                      rounded-lg
                      border border-slate-200
                      bg-slate-100 dark:bg-slate-700
                    "
                  >
                    <ImageOff size={18} className="text-slate-400" />
                  </div>
                );
              })}

              {products.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{products.length - 3} more
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-5 items-center">
              <select
                value={order.orderStatus}
                disabled={actionId === order._id}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className={`
                  px-4 py-2 text-sm font-medium
                  rounded-full border
                  cursor-pointer
                  transition-all
                  ${statusSelectStyle(order.orderStatus)}
                  disabled:opacity-50
                `}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {order.paymentStatus === "PAID" &&
                order.orderStatus === "DELIVERED" &&
                refundStatus === "NONE" && (
                  <button
                    onClick={() => refundOrder(order._id)}
                    className={`
                      flex items-center gap-1
                      px-3 py-1.5 text-xs
                      rounded-lg border
                      ${refundUI.NONE.color}
                    `}
                  >
                    <RefundIcon size={14} />
                    {refundUI.NONE.label}
                  </button>
                )}

              {refundStatus !== "NONE" && (
                <span
                  className={`
                    flex items-center gap-1
                    text-xs px-3 py-1.5
                    rounded-full
                    ${refundUI[refundStatus].color}
                  `}
                >
                  <RefundIcon size={14} />
                  {refundUI[refundStatus].label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminOrdersTab;

