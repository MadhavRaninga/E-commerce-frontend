import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import axios from "axios";

const OrderStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.user);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
        
        // Check if we have authentication (either Redux state or token)
        if (!isAuth && !token) {
          setError("Please login to view order details.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${baseURL}/api/orders/getbyId/${id}`,
          {
            withCredentials: true, // Send cookies
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setOrder(data.order);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("ORDER LOAD ERROR:", err.response || err);

        if (err?.response?.status === 401) {
          setError("Session expired. Please login to view order details.");
          localStorage.removeItem("token");
          // Don't redirect - stay on the page
        } else if (err?.response?.status === 404) {
          setError("Order not found");
          setOrder(null);
        } else {
          setError(err?.response?.data?.message || "Failed to load order");
          setOrder(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, navigate, isAuth, retryCount]); // Retry when auth state changes

  if (loading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen">
        <Navbar />
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <p className="text-xl">Loading order details...</p>
          </div>
        </section>
      </div>
    );
  }

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  // Show order status UI even if there's an error (for better UX)
  // Use order data if available, otherwise show placeholder
  const currentStep = order?.orderStatus 
    ? (statusToStep[order.orderStatus] ?? 0)
    : 0; // Default to first step if no order data
  const normalizedStatus = order?.orderStatus || "Loading...";
  const orderId = order?._id || id || "N/A";

  // Only show error page if it's a 404 (order not found)
  if (!order && !loading && error && error.includes("Order not found")) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen">
        <Navbar />
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-6">Order Status</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl text-red-600 mb-4">
                {error}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Go to My Orders
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-12">Order Status</h2>

        {error && (
          <div className={`p-4 rounded-lg mb-6 ${
            error.includes("Session expired") || error.includes("Please login")
              ? "bg-yellow-50 border border-yellow-400 text-yellow-800"
              : "bg-red-50 border border-red-400 text-red-800"
          }`}>
            <p className="font-semibold">⚠️ {error}</p>
            {error.includes("Session expired") || error.includes("Please login") ? (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Login to View Details
                </button>
                {isAuth && (
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-600 mb-2">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Current Status:{" "}
            <span className={`font-semibold ${
              order ? "text-green-600" : "text-gray-400"
            }`}>
              {order ? normalizedStatus : "Please login to view status"}
            </span>
          </p>
        </div>

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
      </section>
    </div>
  );
};

export default OrderStatus;
