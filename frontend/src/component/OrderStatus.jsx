import Navbar from "../component/Navbar";

const OrderStatus = () => {
  const steps = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStep = 2; // example → later from backend

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-12">Order Status</h2>

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
                    : "bg-gray-300"
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
