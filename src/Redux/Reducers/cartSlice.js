import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://e-commerce-backend-ibt8.onrender.com/api";

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/cart/addtoCart`,
        { productId, quantity },
        { withCredentials: true }
      );
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/cart/getcart`,
        { withCredentials: true }
      );
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Fetch cart failed"
      );
    }
  }
);


export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/cart/updateCart`,
        { itemId, quantity },
        { withCredentials: true }
      );
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Update failed"
      );
    }
  }
);


export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, thunkAPI) => {
    try {
      await axios.delete(
        `${BASE_URL}/cart/delete/${itemId}`,
        { withCredentials: true }
      );
      return itemId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Remove failed"
      );
    }
  }
);

/* ============================
   SLICE
============================ */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    items: [],
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ADD
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
