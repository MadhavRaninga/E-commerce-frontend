import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:5000";

// 🔥 fetch product by id
export const getProductById = createAsyncThunk(
  "productDetails/getById",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/api/products/getbyId/${id}`
      );
      return data.product;  
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const productDetailsSlice = createSlice({
  name: "productDetail",
  initialState: {
    product: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default productDetailsSlice.reducer;