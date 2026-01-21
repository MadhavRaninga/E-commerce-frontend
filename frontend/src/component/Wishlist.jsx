import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { hydrateWishlist, removeFromWishlist } from "../Redux/Reducers/wishlistSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (isAuth) dispatch(hydrateWishlist({ email: user?.email }));
  }, [dispatch, isAuth, user?.email]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold">My Wishlist</h2>
          <p className="text-gray-600">{items.length} items</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-gray-600">Your wishlist is empty.</p>
            <Link to="/" className="inline-block mt-5 px-6 py-2 bg-black text-white rounded-lg">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {items.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image?.url || product.image}
                    alt={product.name || product.title}
                    className="w-full h-80 object-cover"
                  />
                </Link>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name || product.title}
                  </h3>
                  <p className="text-gray-700 font-semibold">₹{product.price}</p>

                  <button
                    onClick={() => dispatch(removeFromWishlist(product._id))}
                    className="w-full mt-2 px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;

