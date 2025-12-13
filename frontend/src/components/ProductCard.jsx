import React from "react";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart, loading } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    addToCart(product);
    console.log("LIST IMAGE:", product.image);
  };

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-800">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          loading="lazy"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>

        <div className="mt-2 mb-5 flex items-center justify-between">
          <span className="text-3xl font-bold text-emerald-400">
            ₹{product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300
            disabled:opacity-50"
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

