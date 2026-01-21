import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Reducers/productSlice";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Homepage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products)
  const { isAuth } = useSelector((state) => state.user);
  console.log("Redux products:", products);

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  return (
    <div className="bg-[#FAF9F6] text-gray-900">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-[93vh]">
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
            <Link
              to={
                cat === "Men"
                  ? "/mens"
                  : cat === "Women"
                    ? "/womens"
                    : "/kids"
              }
              className="block"
            >
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
            </Link>

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
              products.slice(0, 8).map((product) => (
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
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-cover"
                    />

                    <div className="p-5">
                      <h3 className="text-lg font-medium truncate">
                        {product.name}
                      </h3>

                      {/* Price + Discount */}
                      {product.discount && product.discount > 0 ? (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            ₹
                            {product.price -
                              Math.round((product.price * product.discount) / 100)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price}
                          </span>
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            {product.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <p className="mt-2 text-gray-600 font-semibold">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found
              </p>
            )}
          </div>

        </div>
      </section>


      {/* ================= TRUST SECTION ================= */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold">Free Shipping</h3>
              <p className="mt-2 text-gray-600">
                Free delivery on all orders above ₹999
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold">Easy Returns</h3>
              <p className="mt-2 text-gray-600">
                7 days easy return & exchange policy
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="mt-2 text-gray-600">
                100% secure & trusted payment gateways
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER SECTION ================= */}
      <section className="bg-[#FAF9F6] py-28 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold tracking-wide">
            Join Our Fashion Community
          </h2>

          <p className="mt-4 text-gray-600">
            Be the first to know about new arrivals, exclusive offers & sales
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-5 py-3 border border-gray-300 bg-white outline-none focus:border-black transition"
            />
            <button className="px-8 py-3 bg-black text-white font-semibold hover:bg-gray-900 transition">
              Subscribe
            </button>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};
export default Homepage;