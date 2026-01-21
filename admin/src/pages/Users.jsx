import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (user) => {
    try {
      await api.put(`/api/admin/users/${user._id}`, { isAdmin: !user.isAdmin });
      toast.success("User updated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <Layout>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Users</div>
          <div className="muted">View users and set admin role</div>
        </div>
        <button className="btn secondary" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 12 }}>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : users.length === 0 ? (
          <div className="muted">No users found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 170 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td>
                    <span className="badge">{u.isAdmin ? "Admin" : "User"}</span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => toggleAdmin(u)}>
                      {u.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
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

export default Users;

