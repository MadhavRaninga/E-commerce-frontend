import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://e-commerce-backend-vslq.onrender.com";

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
    } catch {
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

// Check authentication status on app load
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("No token found");
      }

      const { data } = await api.get("/api/user/profile", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return data;
    } catch (error) {
      // If auth fails, clear localStorage
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Not authenticated"
      );
    }
  }
);

/* =========================
   HELPER FUNCTIONS
========================= */

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userStr && token) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error loading user from storage:", error);
  }
  return null;
};

// Save user to localStorage
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

/* =========================
   SLICE
========================= */

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuth: !!localStorage.getItem("token"), // Check if token exists
    user: loadUserFromStorage(), // Load user from localStorage
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
        // Save user and token to localStorage
        if (action.payload.user) {
          saveUserToStorage(action.payload.user);
        }
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
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
        // Clear localStorage on logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout API fails, clear local state
        state.isAuth = false;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.error = null;
        // Update localStorage
        if (action.payload.user) {
          saveUserToStorage(action.payload.user);
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        // Clear localStorage if auth check fails
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
