import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

// ✅ Fetch all products
export const sale  = createAsyncThunk(
    "products/getallProduct",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(   
                `${baseURL}/api/products/getallProduct`);

                console.log("🔥 BACKEND RESPONSE:", response.data);
                return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "all product not get"
            );
        }
    }
);

const productSlice = createSlice({
    name: "sale",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sale.pending, (state) => {
                state.loading = true;
            })
            .addCase(sale.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.products || [];
            })
            .addCase(sale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
