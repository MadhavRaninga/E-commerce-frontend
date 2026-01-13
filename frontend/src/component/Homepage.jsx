import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Reducers/productSlice";

const Homepage = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  console.log("Redux products:", products);

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <div className="bg-[#FAF9F6] text-gray-900">

      {/* ================= NAVBAR ================= */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold tracking-widest cursor-pointer">
            CLOTHIFY
          </h1>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a className="hover:text-black">Men</a>
            <a className="hover:text-black">Women</a>
            <a className="hover:text-black">Kids</a>
            <a className="hover:text-black">New</a>
            <a className="hover:text-black">Sale</a>
          </nav>

          <div className="hidden md:flex space-x-6 text-xl text-gray-700">
            <span>🔍</span>
            <span>❤️</span>
            <span className="relative">
              🛒
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1 rounded-full">
                2
              </span>
            </span>
            <span>👤</span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            {open ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t border-gray-200 transition-all duration-300 ${open ? "max-h-screen" : "max-h-0 overflow-hidden"
            }`}
        >
          <nav className="flex flex-col px-6 py-4 space-y-4 text-gray-700">
            <a>Men</a>
            <a>Women</a>
            <a>Kids</a>
            <a>New</a>
            <a>Sale</a>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-[92vh]">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
          className="w-full h-full object-cover"
          alt="Fashion"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-wide">
            New Season Arrivals
          </h1>
          <p className="mt-4 text-lg max-w-xl text-gray-200">
            Premium fashion for Men, Women & Kids
          </p>
          <button className="mt-8 bg-black text-white px-10 py-3 hover:bg-gray-900 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-semibold text-center mb-14">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {["Men", "Women", "Kids"].map((cat, i) => (
            <div
              key={i}
              className="relative group rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm hover:shadow-xl transition"
            >
              <img
                src={
                  cat === "Men"
                    ? "https://i.pinimg.com/1200x/00/86/28/0086281f6383d05b5389ceb0fbf95e87.jpg"
                    : cat === "Women"
                      ? "https://i.pinimg.com/736x/9e/4b/3d/9e4b3d7f5168a155944ebc2e846f761f.jpg"
                      : "https://i.pinimg.com/1200x/aa/79/43/aa794313fbc3c62b36c4f49ceae50653.jpg"
                }
                className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
                alt={cat}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition">
                <h3 className="text-white text-4xl font-bold opacity-0 group-hover:opacity-100 transition">
                  {cat}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Trending Products
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.length !== 0 ? (
              products.map((product) => (
                
                <div
                  key={product._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-lg font-medium truncate">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-gray-600 font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Homepage;