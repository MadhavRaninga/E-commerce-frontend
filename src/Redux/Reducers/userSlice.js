import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   CONFIG
========================= */
const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

const LS_USER_KEY = "clothify:user";
const LS_TOKEN_KEY = "clothify:token";

/* =========================
   LOCAL STORAGE HELPERS
========================= */
function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user) {
  try {
    if (user) {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_USER_KEY);
    }
  } catch {}
}

function saveTokenToStorage(token) {
  try {
    if (token) {
      localStorage.setItem(LS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(LS_TOKEN_KEY);
    }
  } catch {}
}

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL,
  withCredentials: true, // safe even if cookies fail
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
        error?.response?.data?.message || "OTP verification failed"
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
        error?.response?.data?.message || "Password reset failed"
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
    isAuth: !!loadUserFromStorage(),
    user: loadUserFromStorage(),
    error: null,
    message: null,
    resetEmail: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      state.message = null;
      state.resetEmail = null;
      saveUserToStorage(null);
      saveTokenToStorage(null);
    },
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
        saveUserToStorage(action.payload.user);
        if (action.payload?.token) {
          saveTokenToStorage(action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.error = action.payload;
        saveUserToStorage(null);
        saveTokenToStorage(null);
      })

      // REGISTRATION
      .addCase(registration.pending, (state) => {
        state.loading = true;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
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

export const { logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
