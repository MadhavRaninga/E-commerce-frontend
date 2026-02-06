import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { getProducts } from "../Redux/Reducers/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading } = useSelector((state) => state.products);
  const { isAuth } = useSelector((state) => state.user);

  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // Only fetch if products don't exist (they should be loaded in App.jsx)
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

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
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="flex flex-col">
            <span className="text-sm tracking-widest uppercase text-gray-500 mb-4 font-semibold">
              Season — 2024
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              New <br className="hidden sm:block" /> Arrivals
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-md mb-8">
              Discover the latest trends. Fresh styles curated just for you.
            </p>

            <button className="w-max px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition">
              Shop The Drop
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[520px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="New Arrivals"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>


      <section className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {["all", "jacket", "t-shirt", "shirt", "blazer", "hoodie"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilter("all");      // 👈 always stay on all
                setVisibleCount(9);
              }}
              className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                   bg-white border border-gray-300 text-gray-700 hover:bg-black hover:text-white"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </section>



      {/* ================= PRODUCTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {visibleItems.map((item) => (
            <div
              key={item._id}
              className={`relative group overflow-hidden bg-white rounded-xl cursor-pointer transition-all duration-500
                ${item.size === "large" ? "md:col-span-2" : ""}
                ${item.size === "tall" ? "md:row-span-2" : ""}
              `}
            >
              <Link
                to={`/product/${item._id}`}
                className="block w-full h-full"
                onClick={(e) => {
                  if (!isAuth) {
                    e.preventDefault();
                    toast.info("Please login first");
                    navigate("/login");
                  }
                }}
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
              </Link>
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
