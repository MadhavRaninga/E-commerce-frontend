import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "./Footer";
import { getProductById } from "../Redux/Reducers/productDetailSlice";
import { addToCart } from "../Redux/Reducers/cartSlice";
import { addToWishlist, removeFromWishlist } from "../Redux/Reducers/wishlistSlice";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Local states
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState("M")

    const { product, error } = useSelector(
        (state) => state.productDetail
    );
    const { items: wishlistItems = [] } = useSelector((state) => state.wishlist);

    const isWishlisted = useMemo(() => {
        if (!product?._id ) return false;
        return wishlistItems.some((p) => p?._id === product._id);            
    }, [wishlistItems, product])

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    // Handle Quantity Increase
    const increaseQuantity = () => {
        if (product && quantity < product.stock || 0) {
            setQuantity((prev) => prev + 1);
        }
    };

    // Handle Quantity Decrease
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (!product?._id) return;
        dispatch(addToCart({ productId: product._id, quantity }))
    }

    const handleWishlistToggle = () => {
        if (isWishlisted) dispatch(removeFromWishlist(product._id));
        else dispatch(addToWishlist(product));
    };

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!product) {
        return <p className="text-center py-20">Product not found</p>;
    }

    const discountedPrice =
        product.price -
        Math.round((product.price * product.discount || 0) / 100);

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* IMAGE SECTION */}
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[500px] md:h-[600px] rounded-xl bg-center object-cover bg-cover bg-no-repeat bg-contain shadow-sm"
                    />
                </div>

                {/* INFO SECTION */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-sm text-gray-500 mt-2 uppercase tracking-wide">
                            Category: {product.category}
                        </p>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>

                    {/* PRICE SECTION */}
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-red-600">
                                    ₹{discountedPrice}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                                <span className="bg-red-100 text-red-600 px-3 py-1 text-sm font-semibold rounded">
                                    {product.discount}% OFF
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    {/* SIZE SELECTOR (ADDED) */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Select Size:</h3>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center border rounded-lg transition duration-200 font-medium ${selectedSize === size
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-black'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* STOCK INFO */}
                    <div className="text-sm text-gray-600">
                        {product.stock > 0 ? (
                            <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                        ) : (
                            <span className="text-red-600 font-medium">Out of Stock</span>
                        )}
                    </div>

                    {/* ACTION SECTION: Quantity, Cart, Wishlist */}
                    <div className="flex flex-wrap items-center gap-6 pt-4">

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={decreaseQuantity}
                                disabled={quantity === 1}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition text-xl font-medium"
                            >
                                -
                            </button>
                            <span className="px-6 py-2 font-semibold text-lg w-12 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={increaseQuantity}
                                disabled={quantity >= product.stock}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition text-xl font-medium"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <Link to="/cart">
                            <button onClick={handleAddToCart} className="bg-black text-white px-10 py-3 rounded-lg hover:bg-gray-800 transition font-medium shadow-lg active:scale-95 transform duration-150 flex-grow sm:flex-grow-0">
                                Add to Cart

                            </button>
                        </Link>
                        {/* Wishlist Button (ADDED) */}
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-3 rounded-lg border transition duration-200 ${isWishlisted
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500 bg-white'
                                }`}
                            title="Add to Wishlist"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={isWishlisted ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* MORE PARTS (ADDITIONAL INFO) */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Product Highlights</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-600 text-sm">
                                <span className="text-green-500">✓</span> 100% Original Product
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 text-sm">
                                <span className="text-green-500">✓</span> Secure Packaging
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 text-sm">
                                <span className="text-green-500">✓</span> Easy 7 Day Returns
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 text-sm">
                                <span className="text-green-500">✓</span> Pay on Delivery available
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;