import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL,
  withCredentials: true, // 🔥 REQUIRED for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   THUNKS
========================= */

export const registration = createAsyncThunk(
  "user/registration",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const { data } = await api.post("/api/user/registration", {
        name,
        email,
        password,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await api.post("/api/user/login", {
        email,
        password,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/api/user/logout");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const { data } = await api.post("/api/user/sendOtp", { email });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "OTP send failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const { data } = await api.post("/api/user/verify", { email, otp });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "OTP verify failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ email, newPassword, confirmPassword }, thunkAPI) => {
    try {
      const { data } = await api.post("/api/user/resetpassword", {
        email,
        newPassword,
        confirmPassword,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Reset password failed"
      );
    }
  }
);

/* =========================
   SLICE
========================= */

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuth: false,   // 🔥 starts false (cookie checked by backend)
    user: null,
    error: null,
    message: null,
    resetEmail: null,
  },
  reducers: {
    clearMessage(state) {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.message = "Logged out";
      })

      // REGISTRATION
      .addCase(registration.pending, (state) => {
        state.loading = true;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.resetEmail = action.meta.arg.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;
