import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../Redux/Reducers/userSlice";
import { clearCart, getCart } from "../Redux/Reducers/cartSlice";
import { clearWishlist, hydrateWishlist } from "../Redux/Reducers/wishlistSlice";
import { getProducts } from "../Redux/Reducers/productSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux data
  const { products = [] } = useSelector((state) => state.products);
  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const { isAuth, user } = useSelector((state) => state.user);
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist);

  const closeMenu = () => setOpen(false);

  const filteredProducts = search.trim() === ""
    ? []
    : products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase())
    );

  const userEmail = user?.email || "";

  useEffect(() => {
    // Ensure products are loaded once so navbar search works everywhere
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }

    if (isAuth) {
      dispatch(getCart());
      dispatch(hydrateWishlist({ email: userEmail }));
    } else {
      dispatch(clearWishlist());
      dispatch(clearCart());
    }
  }, [dispatch, isAuth, userEmail, products?.length, products]);

  const onProtectedNav = (path) => {
    if (!isAuth) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const onLogout = () => {
    dispatch(logoutUser());
    dispatch(clearWishlist());
    dispatch(clearCart());
    setUserMenuOpen(false);
    navigate("/");
  };

  const filteredProductsSafe = useMemo(() => filteredProducts, [filteredProducts]);

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-widest">
          CLOTHIFY
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/mens">Men</Link>
          <Link to="/womens">Women</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/newarrival">New</Link>
          <Link to="/sale">Sale</Link>
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-6 relative">
          {/* 🔍 SEARCH */}
          <div className="relative">
            <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-white">
              <i className="ri-search-line text-gray-500"></i>
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm w-48"
              />
            </div>

            {/* 🔥 SEARCH DROPDOWN */}
            {search && (
              <div className="absolute top-10 left-0 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                {filteredProducts.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-500">
                    No products found
                  </p>
                ) : (
                  filteredProductsSafe.slice(0, 10).map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      onClick={(e) => {
                        if (!isAuth) {
                          e.preventDefault();
                          toast.info("Please login first");
                          navigate("/login");
                          return;
                        }
                        setSearch("");
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price}</p>
                      </div>

                      <i className="ri-shopping-cart-2-line text-gray-500"></i>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ❤️ WISHLIST */}
          <button
            onClick={() => onProtectedNav("/wishlist")}
            className="relative"
            aria-label="Wishlist"
          >
            <i className="ri-heart-3-line cursor-pointer"></i>
            {isAuth && wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </button>

          {/* 🛒 CART */}
          <button
            onClick={() => onProtectedNav("/cart")}
            className="relative"
            aria-label="Cart"
          >
            <i className="ri-shopping-cart-2-line cursor-pointer"></i>
            {isAuth && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
          {/* 📦 MY ORDERS */}
          <button
            onClick={() => onProtectedNav("/orders")}
            className="relative"
            aria-label="My Orders"
          >
            <i className="ri-file-list-3-line cursor-pointer"></i>
          </button>

          {/* 👤 USER / AUTH */}
          {!isAuth ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((s) => !s)}
                className="flex items-center gap-2"
                aria-label="User menu"
              >
                <i className="ri-user-3-line cursor-pointer"></i>
                <span className="text-sm text-gray-700 max-w-40 truncate">
                  {user?.name || userEmail}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden bg-[#FAF9F6] border-t px-6 py-5 space-y-5">

          {/* 🔍 MOBILE SEARCH */}
          <div className="relative">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <i className="ri-search-line text-gray-500"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>

            {search && (
              <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto z-50">
                {filteredProducts.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No products found
                  </p>
                ) : (
                  filteredProductsSafe.slice(0, 6).map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      onClick={() => {
                        setSearch("");
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 📂 NAV LINKS (PLAIN LINKS) */}
          <div className="flex flex-col gap-2 text-gray-800 font-medium">
            {["mens", "womens", "kids", "newarrival", "sale"].map((route) => (
              <Link
                key={route}
                to={`/${route}`}
                onClick={closeMenu}
                className="py-2 text-lg border-b border-gray-200 hover:text-black hover:underline"
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </Link>
            ))}
          </div>


          {/* ❤️ CART & WISHLIST */}
          <div className="flex gap-4 pt-3 border-t">
            <button
              onClick={() => {
                closeMenu();
                onProtectedNav("/wishlist");
              }}
              className="flex-1 flex justify-center items-center gap-2 py-3 border rounded-lg bg-white"
            >
              <i className="ri-heart-3-line"></i>
              Wishlist
              {isAuth && wishlistItems.length > 0 && (
                <span className="bg-black text-white text-xs px-2 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                closeMenu();
                onProtectedNav("/cart");
              }}
              className="flex-1 flex justify-center items-center gap-2 py-3 border rounded-lg bg-white"
            >
              <i className="ri-shopping-cart-2-line"></i>
              Cart
              {isAuth && cartItems.length > 0 && (
                <span className="bg-black text-white text-xs px-2 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
          {/* 📦 MY ORDERS */}
          <button
            onClick={() => {
              closeMenu();
              onProtectedNav("/orders");
            }}
            className="flex justify-center items-center gap-2 py-3 border rounded-lg bg-white mt-3"
          >
            <i className="ri-file-list-3-line"></i>
            My Orders
          </button>


          {/* 👤 AUTH / USER */}
          {!isAuth ? (
            <div className="flex gap-3 pt-3 border-t">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 py-3 text-center border rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex-1 py-3 text-center bg-black text-white rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t space-y-2">
              <p className="text-sm text-gray-700 truncate">
                {user?.name || userEmail}
              </p>
              <button
                onClick={() => {
                  closeMenu();
                  onLogout();
                }}
                className="w-full py-3 border border-black rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      )}

    </header>
  );
};

export default Navbar;
