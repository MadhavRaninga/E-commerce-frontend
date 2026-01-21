import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:5000";

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

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    message: null,
    lastOrder: null,
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
        state.message = null;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;

