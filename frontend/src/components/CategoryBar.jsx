import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const categories = [
	{ name: "Electronics", slug: "electronics" },
	{ name: "TVs & Appliances", slug: "tv" },
	{ name: "AC & Coolers", slug: "ac" },
	{ name: "Fans", slug: "fan" },
	{ name: "Wires & Cables", slug: "wires & cables" },
	{ name: "Refrigerators", slug: "refrigerators" },
];

const CategoryBar = () => {
	const location = useLocation();

	return (
		<div className="sticky top-16 z-40 bg-white dark:bg-slate-900 border-b">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex gap-8 py-3 overflow-x-auto">
					{categories.map((cat) => {
						const active = location.pathname.includes(cat.slug);

						return (
							<NavLink
								key={cat.slug}
								to={`/category/${cat.slug}`}
								className={`relative text-sm font-medium whitespace-nowrap transition
								${
									active
										? "text-indigo-600 dark:text-indigo-400"
										: "text-slate-700 dark:text-slate-200 hover:text-indigo-600"
								}`}
							>
								{cat.name}
								{active && (
									<span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded" />
								)}
							</NavLink>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CategoryBar;
