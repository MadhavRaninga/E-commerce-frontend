import SignIn from "./component/SignIn";
import Signup from "./component/Signup";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>}></Route>
          <Route path="/login" element={<SignIn/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
          <Route path="/verifyOtp" element={<VerifyOtp/>}></Route>
          <Route path="/resetPassword" element={<ResetPass/>}></Route>
          <Route path="/mens" element={<Mens/>}></Route>
          <Route path="/womens" element={<Womens/>}></Route>
          <Route path="/kids" element={<Kids/>}></Route>
          <Route path="/newarrival" element={<NewArrivals/>}></Route>
          <Route path="/sale" element={<Sale/>}></Route>
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/footer" element={<Footer/>}></Route>


        </Routes>
            <ToastContainer theme="dark" position="top-center" />
      </BrowserRouter>
    </>
  );
};

export default App;
