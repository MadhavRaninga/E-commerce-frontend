import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Reducers/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Kids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { isAuth } = useSelector((state) => state.user);
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("");

  // Only fetch if products don't exist (they should be loaded in App.jsx)
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

  // 🔹 Filter only Kids' products
  const kidsProducts = products.filter(
    (product) => product.category?.toLowerCase() === "kids"
  );

  const sortedProducts = useMemo(() => {
    let filtered = [...kidsProducts];

    // 🔹 PRICE FILTER
    if (priceRange === "below1000") {
      filtered = filtered.filter((p) => p.price < 1000);
    }

    if (priceRange === "1000to2000") {
      filtered = filtered.filter(
        (p) => p.price >= 1000 && p.price <= 2000
      );
    }

    if (priceRange === "above2000") {
      filtered = filtered.filter((p) => p.price > 2000);
    }

    // 🔹 SORT
    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [kidsProducts, sort, priceRange]);


  return (
    <div className="bg-[#FAF9F6] min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative h-[55vh]">
        <img
          src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4"
          alt="Kids Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Kids’ Collection
          </h1>
          <p className="mt-3 text-gray-200 text-lg">
            Fun, comfortable, and colorful styles
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="hidden lg:block bg-white p-6 rounded-xl shadow-sm h-fit sticky top-28 self-start">
            <h3 className="text-lg font-semibold mb-6">Filters</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Boys Wear</li>
                <li>Girls Wear</li>
                <li>Infants & Toddlers</li>
                <li>Footwear</li>
                <li>Toys & Accessories</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Price</h4>
              <ul className="space-y-2 text-gray-600">
                <li
                  onClick={() => setPriceRange("all")}
                  className="cursor-pointer hover:text-black"
                >
                  All
                </li>
                <li
                  onClick={() => setPriceRange("below1000")}
                  className="cursor-pointer hover:text-black"
                >
                  Below ₹1000
                </li>
                <li
                  onClick={() => setPriceRange("1000to2000")}
                  className="cursor-pointer hover:text-black"
                >
                  ₹1000 – ₹2000
                </li>
                <li
                  onClick={() => setPriceRange("above2000")}
                  className="cursor-pointer hover:text-black"
                >
                  Above ₹2000
                </li>
              </ul>
            </div>
          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <div className="lg:col-span-3">

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-semibold">
                Kids’ Products ({sortedProducts.length})
              </h2>

              {/* SORT DROPDOWN */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border px-4 py-2 bg-white cursor-pointer rounded-lg"
              >
                <option value="">Sort by</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    onClick={(e) => {
                      if (!isAuth) {
                        e.preventDefault();
                        toast.info("Please login first");
                        navigate("/login");
                      }
                    }}
                  >
                    <div
                      key={product._id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-80">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />

                        {/* Category badge */}
                        <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full uppercase">
                          {product.category}
                        </span>

                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300">
                          <button className="bg-white px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition rounded-md">
                            Add to Cart
                          </button>
                          <button className="bg-white px-3 py-2 hover:bg-black hover:text-white transition rounded-md">
                            ❤️
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-semibold truncate">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-bold">
                            ₹{product.price}
                          </span>

                          <span
                            className={`text-sm font-medium ${product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          >
                            {product.stock > 0
                              ? `In Stock`
                              : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-10">
                  No kids’ products found
                </p>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Kids;