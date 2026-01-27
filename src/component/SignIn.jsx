import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, login } from "../Redux/Reducers/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, message } = useSelector((state) => state.user);

  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));

    setEmail("")
    setPassword("")
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage())
      navigate("/")
    }
    if (error) {
      toast.error(error)
      dispatch(clearMessage())
    }
  }, [message, error, dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <form
        onSubmit={loginHandler}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to continue shopping
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-6">
          <Link to= "/forgotpassword" className="text-sm text-indigo-600 hover:underline cursor-pointer">
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
