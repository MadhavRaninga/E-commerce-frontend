import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/api/products/getbyId/${id}`);
        const p = data.product;
        setName(p.name || "");
        setDescription(p.description || "");
        setPrice(p.price ?? "");
        setStock(p.stock ?? "");
        setCategory(p.category || "");
        setDiscount(p.discount ?? "");
        setIsNewArrival(!!p.isNewArrival);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load product");
      }
    })();
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name || !description || !price || !stock || !category) {
        toast.info("Please fill required fields");
        return;
      }

      if (!isEdit && !image) {
        toast.info("Image is required for new product");
        return;
      }

      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("stock", stock);
      form.append("category", category);
      form.append("discount", discount || 0);
      form.append("isNewArrival", isNewArrival);
      if (image) form.append("image", image);

      if (isEdit) {
        await api.put(`/api/products/updateProduct/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        await api.post(`/api/products/addProduct`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added");
      }

      navigate("/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>
            {isEdit ? "Edit Product" : "Add Product"}
          </div>
          <div className="muted">Manage your catalog</div>
        </div>
        <button className="btn secondary" onClick={() => navigate("/products")}>
          Back
        </button>
      </div>

      <div className="card" style={{ padding: 16, maxWidth: 820 }}>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <div>
              <label className="muted" style={{ fontSize: 12 }}>
                Name *
              </label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="muted" style={{ fontSize: 12 }}>
                Category *
              </label>
              <input
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="men / women / kids ..."
              />
            </div>
          </div>

          <div>
            <label className="muted" style={{ fontSize: 12 }}>
              Description *
            </label>
            <textarea
              className="input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <div>
              <label className="muted" style={{ fontSize: 12 }}>
                Price *
              </label>
              <input
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div>
            <div>
              <label className="muted" style={{ fontSize: 12 }}>
                Stock *
              </label>
              <input
                className="input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
              />
            </div>
            <div>
              <label className="muted" style={{ fontSize: 12 }}>
                Discount (%)
              </label>
              <input
                className="input"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                type="number"
              />
            </div>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            <span>Mark as New Arrival</span>
          </label>

          <div>
            <label className="muted" style={{ fontSize: 12 }}>
              Image {isEdit ? "(optional)" : "*"}
            </label>
            <input
              className="input"
              style={{ padding: 8 }}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <button className="btn" disabled={loading} type="submit">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProductForm;

