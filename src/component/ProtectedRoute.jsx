import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (!isAuth) toast.info("Please login first");
  }, [isAuth]);

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

