import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/orders");
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/updateStatus/${orderId}`, { status });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Orders</div>
          <div className="muted">View all orders and update status</div>
        </div>
        <button className="btn secondary" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 12 }}>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="muted">No orders found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
                <th style={{ width: 240 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {o.user?.name || "User"}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {o.user?.email}
                    </div>
                  </td>
                  <td>₹{Math.round(o.total || 0)}</td>
                  <td>
                    <span className="badge">{o.orderStatus}</span>
                  </td>
                  <td className="muted">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </td>
                  <td>
                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <button
                        className="btn secondary"
                        onClick={() => updateStatus(o._id, "Processing")}
                      >
                        Processing
                      </button>
                      <button
                        className="btn"
                        onClick={() => updateStatus(o._id, "Shipped")}
                      >
                        Shipped
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => updateStatus(o._id, "Delivered")}
                      >
                        Delivered
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Orders;

