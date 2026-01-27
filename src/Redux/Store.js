import { configureStore } from "@reduxjs/toolkit";
import  userSlice  from "./Reducers/userSlice";
import productSlice from "./Reducers/productSlice"
import productDetailsSlice from "./Reducers/productDetailSlice"
import cartSlice from "./Reducers/cartSlice"
import wishlistSlice from "./Reducers/wishlistSlice"
import orderSlice from "./Reducers/orderSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    productDetail: productDetailsSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    order: orderSlice
  },
});
