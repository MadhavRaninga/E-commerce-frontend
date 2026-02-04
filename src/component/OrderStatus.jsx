import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import axios from "axios";

const OrderStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = "https://e-commerce-backend-vslq.onrender.com";

  const steps = [
    "Order Placed",
    "Processing",
    "Out for Delivery",
    "Delivered",
  ];

  const statusToStep = {
    "Order Placed": 0,
    "Processing": 1,
    "Out for Delivery": 2,
    "Delivered": 3,
  };

  useEffect(() => {
    if (!id) {
      toast.error("Invalid order ID");
      navigate("/");
      return;
    }

    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${baseURL}/api/orders/getbyId/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setOrder(data.order);
      } catch (err) {
        console.error("ORDER LOAD ERROR:", err.response || err);

        
        if (err?.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error(
            err?.response?.data?.message || "Failed to load order"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate]);

  const currentStep = statusToStep[order?.orderStatus] ?? 0;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-12">Order Status</h2>

        {loading ? (
          <p className="text-gray-500">Loading order details...</p>
        ) : !order ? (
          <p className="text-red-500">Order not found</p>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border flex items-center gap-4 ${
                  index <= currentStep
                    ? "bg-green-50 border-green-500"
                    : "bg-white"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index <= currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderStatus;
