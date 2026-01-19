import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { newArrival } from "../Redux/Reducers/newSlice";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const { products = [] } = useSelector((state) => state.products);

  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // Fetch products
  useEffect(() => {
    dispatch(newArrival());
  }, [dispatch]);

  // Filter products
  const filteredItems = useMemo(() => {

    const newItems = products.filter(
      (item) => item.isNewArrival === true
    );

    if (filter === "all") return newItems;

    return newItems.filter(
      (item) => item.category?.toLowerCase() === filter
    );
  }, [products, filter]);

  // Visible products (Load More)
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[75vh] flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-[#F0EFE9] flex flex-col justify-center px-10 md:px-20 py-12">
          <span className="text-sm tracking-widest uppercase text-gray-500 mb-4 font-semibold">
            Season — 2024
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
            New <br /> Arrivals
          </h1>
          <p className="text-gray-600 text-lg max-w-md mb-8">
            Discover the latest trends. Fresh styles curated just for you.
          </p>
          <button className="w-max px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition">
            Shop The Drop
          </button>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="New Arrivals"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex gap-4 overflow-x-auto">
          {["All", "Jacket", "T-shirt", "Blazer", "Hoodie"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilter(item.toLowerCase());
                setVisibleCount(9); // ✅ reset here (NO useEffect)
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                filter === item.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:mt-0 mt-[150px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {visibleItems.map((item) => (
            <div
              key={item._id}
              className={`relative group overflow-hidden bg-white rounded-xl cursor-pointer transition-all duration-500
                ${item.size === "large" ? "md:col-span-2" : ""}
                ${item.size === "tall" ? "md:row-span-2" : ""}
              `}
            >
              <img
                src={item.image?.url || item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              {/* Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="bg-white px-6 py-2 rounded-full font-medium">
                  Quick View
                </span>
              </div>

              {/* Info */}
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs uppercase tracking-wider mb-1">
                  {item.category}
                </p>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="font-medium mt-1">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= LOAD MORE ================= */}
        {visibleCount < filteredItems.length && (
          <div className="text-center mt-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-10 py-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition"
            >
              Load More Products
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default NewArrivals;
