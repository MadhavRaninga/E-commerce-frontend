import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { saveAdmin, loadAdmin } from "../lib/auth";
import { toast } from "react-toastify";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const admin = loadAdmin();

  const logout = () => {
    saveAdmin(null);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="row" style={{ marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 1 }}>CLOTHIFY</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Admin Panel
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {admin?.name || "Admin"}
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            {admin?.email}
          </div>
        </div>

        <nav className="grid" style={{ gap: 8 }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navlink ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `navlink ${isActive ? "active" : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `navlink ${isActive ? "active" : ""}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `navlink ${isActive ? "active" : ""}`
            }
          >
            Orders
          </NavLink>
        </nav>

        <div style={{ marginTop: 16 }}>
          <button className="btn danger" style={{ width: "100%" }} onClick={logout}>
            Logout
          </button>
        </div>

        <div className="muted" style={{ marginTop: 14, fontSize: 12 }}>
          Backend: `http://localhost:5000`
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;

