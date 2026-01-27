import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

// ✅ Fetch all products
export const mensProduct = createAsyncThunk(
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
    name: "mensProduct",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(mensProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(mensProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.products || [];
            })
            .addCase(mensProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
