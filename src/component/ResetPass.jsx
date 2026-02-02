import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, resetPassword } from "../Redux/Reducers/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ResetPass = () => {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [newPassword, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const { error, message , resetEmail } = useSelector((state) => state.user)
    const resetPasswordHandler = (e) => {
        e.preventDefault();console.log("RESET EMAIL FROM REDUX:", resetEmail)

        dispatch(resetPassword({email: resetEmail, newPassword, confirmPassword }))
        
        console.log({ newPassword, confirmPassword, email:resetEmail });
        setPassword("")
        setConfirmPassword("")
    };

    useEffect(()=>{
        if (message) {
            toast.success(message)
            dispatch(clearMessage())
            navigate("/login")
        }
        if (error) {
            toast.error(error)
            dispatch(clearMessage())
        }
    }, [message, error, navigate, dispatch])
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <form
                onSubmit={resetPasswordHandler}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Reset Password 🔑
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Create a new password for your account
                </p>

                {/* New Password */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                    Update Password
                </button>

                {/* Back to login */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline cursor-pointer">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPass;
