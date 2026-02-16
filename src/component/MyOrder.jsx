import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../Redux/Reducers/orderSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [] } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // Filter out "Delivered" orders - only show active orders
  const activeOrders = orders.filter(
    (order) => order.orderStatus !== "Delivered"
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {activeOrders.length === 0 ? (
          <p className="text-gray-500">No active orders found.</p>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">{order._id}</p>
                  <p className="text-sm mt-1">
                    Status: <b>{order.orderStatus}</b>
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
                >
                  View Status
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
