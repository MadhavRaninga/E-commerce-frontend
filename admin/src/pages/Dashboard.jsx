import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const StatCard = ({ label, value }) => (
  <div className="card" style={{ padding: 16 }}>
    <div className="muted" style={{ fontSize: 12 }}>
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/admin/stats");
        setStats(data.stats);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Dashboard</div>
          <div className="muted">Overview of your store</div>
        </div>
      </div>

      {loading ? (
        <div className="muted">Loading...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <StatCard label="Users" value={stats.users} />
          <StatCard label="Products" value={stats.products} />
          <StatCard label="Orders" value={stats.orders} />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

