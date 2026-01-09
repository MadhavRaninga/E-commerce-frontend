import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearMessage, forgotPassword } from "../Redux/Reducers/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {error, message} = useSelector((state)=>state.user)

    const forgotPasswordHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({email}))

        setEmail("")
        console.log(email);
    };

    useEffect(()=>{
        if (message) {
            toast.success(message)
            navigate("/verifyOtp")
            dispatch(clearMessage())
        }
        if (error) {
            toast.error(error)
            dispatch(clearMessage())
        }
    }, [message, error, dispatch, navigate])
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <form
                onSubmit={forgotPasswordHandler}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Forgot Password 🔐
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Enter your email to reset your password
                </p>

                {/* Email */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                    Send OTP
                </button>

                {/* Back to login */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <Link to="/" className="text-indigo-600 font-medium hover:underline cursor-pointer">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
