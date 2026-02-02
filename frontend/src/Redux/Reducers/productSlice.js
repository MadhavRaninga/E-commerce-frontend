import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = "https://e-commerce-backend-vslq.onrender.com";

// ✅ Fetch all products
export const getProducts = createAsyncThunk(
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
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                // backend responds with { success, products }
                state.products = action.payload?.products || [];
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
