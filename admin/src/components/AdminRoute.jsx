import React from "react";
import { Navigate } from "react-router-dom";
import { loadAdmin } from "../lib/auth";

const AdminRoute = ({ children }) => {
  const admin = loadAdmin();
  if (!admin) return <Navigate to="/login" replace />;
  return children;
};

export default AdminRoute;

