import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <AdminRoute>
              <ProductForm mode="new" />
            </AdminRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <AdminRoute>
              <ProductForm mode="edit" />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

