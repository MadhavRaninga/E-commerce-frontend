import { useDispatch, useSelector } from "react-redux";
import {
    getCart,
    removeCartItem,
    updateCartQuantity
} from "../Redux/Reducers/cartSlice";
import Navbar from "../component/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items } = useSelector((state) => state.cart);

    const total = items.reduce(
        (sum, i) =>
            sum + ((i.product?.price || 0) - ((i.product?.price || 0) * (i.product?.discount || 0)) / 100) * i.quantity,
        0
    );

    useEffect(() => {
        dispatch(getCart())
    }, [dispatch])

    const handleDec = (id, quantity) => {
        dispatch(updateCartQuantity({ itemId: id, quantity: quantity - 1 }))
    }
    const handleInc = (id, quantity) => {
        dispatch(updateCartQuantity({ itemId: id, quantity: quantity + 1 }))
    }

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            <Navbar />

            <section className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-semibold mb-10">Shopping Cart</h2>

                {items.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty</p>
                ) : (
                    <div className="space-y-8">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-xl shadow"
                            >
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-28 h-28 object-cover rounded"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.product.name}</h3>

                                    <p className="text-gray-600">
                                        ₹ {Math.round(item.product.price - (item.product.price * (item.product.discount || 0)) / 100)}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                        <button
                                            disabled={item.quantity === 1}
                                            onClick={() => handleDec(item._id, item.quantity)}
                                            className="px-3 py-1 cursor-pointer border disabled:opacity-50"
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() => handleInc(item._id, item.quantity)}
                                            className="px-3 cursor-pointer py-1 border"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() =>
                                                dispatch(removeCartItem(item._id))
                                            }
                                            className="sm:ml-6 cursor-pointer text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* TOTAL */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            <h3 className="text-xl font-semibold">Total</h3>
                            <h3 className="text-xl font-bold">₹{Math.round(total)}</h3>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-black text-white py-4 text-lg hover:bg-gray-900 transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Cart;
