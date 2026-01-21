import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/products/getallProduct");
      setProducts(data.products || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/deleteProduct/${id}`);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>Products</div>
          <div className="muted">Add / Edit / Delete products</div>
        </div>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn secondary" onClick={load}>
            Refresh
          </button>
          <Link className="btn" to="/products/new">
            + Add Product
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        {loading ? (
          <div className="muted">Loading...</div>
        ) : products.length === 0 ? (
          <div className="muted">No products found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ width: 220 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: 44,
                          height: 44,
                          objectFit: "cover",
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {p._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <Link className="btn secondary" to={`/products/${p._id}/edit`}>
                        Edit
                      </Link>
                      <button className="btn danger" onClick={() => remove(p._id)}>
                        Delete
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

export default Products;

