import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = "http://localhost:5000";

// ✅ Fetch all products
export const womensProduct = createAsyncThunk(
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
    name: "womensProduct",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(womensProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(womensProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.products || [];
            })
            .addCase(womensProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
