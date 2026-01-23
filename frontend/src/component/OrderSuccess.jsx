import { useParams, Link } from "react-router-dom";
import Navbar from "../component/Navbar";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Order Placed Successfully <object data="" type=""></object>
        </h1>

        <p className="text-gray-600 mb-6">
          Your order ID is <strong>{id}</strong>
        </p>

        <Link
          to={`/orders/${id}`}
          className="px-8 py-3 bg-black text-white rounded"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
