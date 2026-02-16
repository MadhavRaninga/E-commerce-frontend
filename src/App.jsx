import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "./component/SignIn";
import Signup from "./component/Signup";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { checkAuth } from "./Redux/Reducers/userSlice";
import { getProducts } from "./Redux/Reducers/productSlice";

import ForgotPassword from "./component/ForgotPassword";
import VerifyOtp from "./component/VerifyOtp";
import ResetPass from "./component/ResetPass";
import Homepage from "./component/Homepage";
import Mens from "./component/Mens";
import Womens from "./component/Women";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Kids from "./component/Kids";
import NewArrivals from "./component/NewArrival";
import Sale from "./component/Sale";
import ProductDetails from "./component/ProductDetail";
import Cart from "./component/Cart";
import ProtectedRoute from "./component/ProtectedRoute";
import Wishlist from "./component/Wishlist";
import Checkout from "./component/Checkout";
import OrderSuccess from "./component/OrderSuccess";
import OrderStatus from "./component/OrderStatus";
import MyOrders from "./component/MyOrder";
import ClothifyLoader from "./component/ClothifyLoader";

const App = () => {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(true);

  // Check auth + prefetch products on app load (don't wait for loader)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkAuth());
    }
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      {showLoader && (
        <ClothifyLoader onFinish={() => setShowLoader(false)} />
      )}

      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/verifyOtp" element={<VerifyOtp />} />
          <Route path="/resetPassword" element={<ResetPass />} />
          <Route path="/mens" element={<Mens />} />
          <Route path="/womens" element={<Womens />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/newarrival" element={<NewArrivals />} />
          <Route path="/sale" element={<Sale />} />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/orders/:id" element={<OrderStatus />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
        <ToastContainer theme="dark" position="top-center" />
      </BrowserRouter>
    </>
  );
};

export default App;
