import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { getProducts } from "../Redux/Reducers/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { isAuth } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const saleProducts = products.filter(
    (product) => product.discount && product.discount > 0
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      {/* ================= SALE HERO ================= */}
      <section className="relative h-[60vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1521334884684-d80222895322"
          alt="Sale Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <span className="uppercase tracking-widest text-sm text-gray-300">
            Limited Time Only
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-wide">
            Mega Sale
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-xl">
            Up to <span className="text-red-400 font-bold">50% OFF</span> on
            premium fashion for Men, Women & Kids
          </p>
        </div>
      </section>

      {/* ================= SALE INFO STRIP ================= */}
      <section className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-medium">🚚 Free Shipping on orders above ₹999</p>
          <p className="font-medium">⏳ Hurry! Sale ends soon</p>
          <p className="font-medium">🔄 Easy 7-day returns</p>
        </div>
      </section>

      {/* ================= SALE PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-semibold">
            Hot Deals ({saleProducts.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {saleProducts.length > 0 ? (
            saleProducts.map((product) => {
              const discountedPrice = product.price - Math.round((product.price * product.discount) / 100);
              
              return (
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
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                    />

                    {/* Discount badge */}
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {product.discount}% OFF
                    </span>

                    {/* Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-white px-5 py-2 font-semibold hover:bg-black hover:text-white transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-semibold truncate">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-red-600">
                        ₹{discountedPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 uppercase">
                      {product.category}
                    </p>
                  </div>
                </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No sale products available
            </p>
          )}
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default Sale;
