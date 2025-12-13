import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "freeze",
  "air-conditioner",
  "fans",
  "cooler",
  "wires",
  "cables",
  "tv",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.image) {
      alert("Please upload an image");
      return;
    }

    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
      });

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log("error creating a product", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, name: e.target.value }))
          }
          required
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, description: e.target.value }))
          }
          required
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, price: e.target.value }))
          }
          required
          className="w-full bg-gray-700 text-white p-2 rounded"
        />

        <select
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, category: e.target.value }))
          }
          required
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded flex justify-center"
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <PlusCircle className="mr-2" /> Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
