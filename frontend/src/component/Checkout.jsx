import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { placeOrder, clearOrderState } from "../Redux/Reducers/orderSlice";
import { getCart } from "../Redux/Reducers/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const { loading, error, message } = useSelector((state) => state.order);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const total = items.reduce(
    (sum, i) =>
      sum +
      ((i.product?.price || 0) -
        ((i.product?.price || 0) * (i.product?.discount || 0)) / 100) *
        i.quantity,
    0
  );

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearOrderState());
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearOrderState());
    }
  }, [message, error, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !pincode) {
      toast.info("Please fill all address details");
      return;
    }
    dispatch(placeOrder({ address, city, pincode }));
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Address / Payment (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Delivery Details</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Flat / House no, Street, Area"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="6 digit pincode"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-gray-50">
                <input type="radio" checked readOnly />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-xs text-gray-600">
                    Pay in cash when your order is delivered.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Placing Order..." : `Place Order (₹${Math.round(total)})`}
            </button>
          </form>
        </div>

        {/* Order Summary (1/3 width) */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹
                      {Math.round(
                        ((item.product?.price || 0) -
                          ((item.product?.price || 0) *
                            (item.product?.discount || 0)) /
                            100) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{Math.round(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;

