import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
const CategoryPage = () => {
	const { category } = useParams(); 
	const { products } = useProductStore();
	const filteredProducts = products.filter(
		(product) =>
			product.category.toLowerCase() === category.toLowerCase()
	);
	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6 capitalize">
				{category} Products
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{filteredProducts.map((product) => (
					<div
						key={product.id}
						className="relative overflow-hidden h-80 w-full rounded-lg group shadow-lg"
					>
						<Link to={`/product/${product.id}`}>
							<div className="w-full h-full cursor-pointer">
								<div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900 opacity-50 z-10" />
								<img
									src={product.imageUrl}
									alt={product.name}
									className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
									loading="lazy"
								/>
								<div className="absolute bottom-0 left-0 right-0 p-4 z-20">
									<h3 className="text-white text-xl font-bold">{product.name}</h3>
									<p className="text-gray-200 mt-1">₹ {product.price}</p>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
			{filteredProducts.length === 0 && (
				<p className="text-gray-500 text-lg mt-10">
					No products found in this category.
				</p>
			)}
		</div>
	);
};

export default CategoryPage;
