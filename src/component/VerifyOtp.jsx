import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, verifyOtp } from "../Redux/Reducers/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { message, error, resetEmail } = useSelector((state) => state.user)
    const verifyOtpHandler = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ otp, email: resetEmail }))
        setOtp("")
    };
    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch(clearMessage())
            navigate("/resetPassword")
        }
        if (error) {
            toast.error(error)
            dispatch(clearMessage())
        }
    }, [message, error, dispatch, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <form
                onSubmit={verifyOtpHandler}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Verify OTP 🔐
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Enter the OTP sent to your email
                </p>

                {/* OTP Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        OTP
                    </label>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full px-4 py-3 text-center tracking-widest text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                    Verify OTP
                </button>

                {/* Resend */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Didn’t receive OTP?{" "}
                    <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
                        Resend
                    </span>
                </p>
            </form>
        </div>
    );
};

export default VerifyOtp;
