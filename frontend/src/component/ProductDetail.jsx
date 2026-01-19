import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { getProductById } from "../Redux/Reducers/productDetailSlice";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { product, error } = useSelector(
        (state) => state.productDetail
    )
    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);


    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!product) {
        return <p className="text-center py-20">Product not found</p>;
    }


    const discountedPrice =
        product.price -
        Math.round((product.price * product.discount) / 100);

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* IMAGE */}
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[500px] md:h-[600px] rounded-xl bg-center object-cover bg-cover bg-no-repeat bg-contain"
                    />
                </div>

                {/* INFO */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    <p className="text-gray-600">{product.description}</p>

                    <div className="flex items-center gap-4">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-red-600">
                                    ₹{discountedPrice}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="bg-red-600 text-white px-3 py-1 text-sm rounded">
                                    {product.discount}% OFF
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    <p className="uppercase text-sm text-gray-500">
                        Category: {product.category}
                    </p>

                    <p className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </p>

                    <button className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition">
                        Add to Cart
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;
