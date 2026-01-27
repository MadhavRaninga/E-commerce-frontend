import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

export const placeOrder = createAsyncThunk(
  "order/place",
  async ({ address, city, pincode }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${baseURL}/api/orders/orderPlace`,
        { address, city, pincode },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Order failed"
      );
    }
  }
);
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/api/orders/getAllOrders`,
        { withCredentials: true }
      );
      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    message: null,
    lastOrder: null,
    orders: [], // ✅ IMPORTANT
  },
  reducers: {
    clearOrderState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* PLACE ORDER */
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Order placed successfully";
        state.lastOrder = action.payload?.order || null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET MY ORDERS */
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;