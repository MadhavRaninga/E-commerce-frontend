import React, { useState } from "react";
import { api } from "../lib/api";
import { saveAdmin } from "../lib/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/login", { email, password });
      saveAdmin(data.user);
      toast.success(data.message || "Logged in");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Admin Login</div>
          <div className="muted">Only admin users can login here.</div>
        </div>

        <form onSubmit={onSubmit} className="grid">
          <div>
            <label className="muted" style={{ fontSize: 12 }}>
              Email
            </label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="muted" style={{ fontSize: 12 }}>
              Password
            </label>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
          If you don’t have an admin yet, set `isAdmin:true` for your user in MongoDB.
        </div>
      </div>
    </div>
  );
};

export default Login;

