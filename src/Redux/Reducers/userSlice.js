import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = "https://e-commerce-backend-ibt8.onrender.com";

const LS_USER_KEY = "clothify:user";
const LS_TOKEN_KEY = "clothify:token";

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUserToStorage(user) {
  try {
    if (!user) localStorage.removeItem(LS_USER_KEY);
    else localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
}

function saveTokenToStorage(token) {
  try {
    if (!token) localStorage.removeItem(LS_TOKEN_KEY);
    else localStorage.setItem(LS_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
}

export const registration = createAsyncThunk(
  "user/registration",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/user/registration`,
        { name, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Registration Failed"
      );
    }
  }
);
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Login Failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/sendOtp",
  async ({ email }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/user/sendOtp`,
        { email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message
      )
    }
  }
)
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({email, otp }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/user/verify`,
        { email, otp },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message
      )
    }
  }
)
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({email, newPassword, confirmPassword  }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/user/resetpassword`,
        {email, newPassword, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message
      )
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuth: !!loadUserFromStorage(),
    user: loadUserFromStorage(),
    error: null,
    message: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      state.message = null;
      saveUserToStorage(null);
      saveTokenToStorage(null);
    },
    clearMessage(state) {
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        (state.loading = true),
          (state.isAuth = false),
          (state.user = null),
          (state.error = null);
      })
      .addCase(login.fulfilled, (state, action) => {
        (state.loading = false),
          (state.isAuth = true),
          (state.user = action.payload.user),
          (state.message = action.payload.message),
          (state.error = null)
        saveUserToStorage(action.payload.user);
        // store jwt for Authorization header fallback (helps when cookies are blocked on deploy)
        if (action.payload?.token) saveTokenToStorage(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        (state.loading = false),
          (state.isAuth = false),
          (state.user = null),
          (state.error = action.payload);
        state.message = null
        saveUserToStorage(null);
        saveTokenToStorage(null);
      })
      .addCase(registration.pending, (state) => {
        (state.loading = true),
          (state.user = null),
          (state.error = null);
        state.message = null
      })
      .addCase(registration.fulfilled, (state, action) => {
        (state.loading = false),
          (state.user = action.payload.user),
          (state.message = action.payload.message),
          (state.error = null)
        // registration doesn't log in automatically on backend? keep local storage in sync if it does return user
        if (action.payload?.user) saveUserToStorage(action.payload.user);
      })
      .addCase(registration.rejected, (state, action) => {
        (state.loading = false),
          (state.user = null),
          (state.error = action.payload);
        state.message = null
      })
      .addCase(forgotPassword.pending, (state) => {
        (state.loading = true),
          (state.error = null);
        (state.message = null)
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        (state.loading = false),
          (state.resetEmail = action.meta.arg.email),
          (state.message = action.payload.message),
          (state.error = null)
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload);
        state.message = null
      })
      .addCase(verifyOtp.pending, (state) => {
        (state.loading = true),
          (state.error = null);
        (state.message = null)
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        (state.loading = false),
          (state.resetEmail = action.payload.email),
          (state.message = action.payload.message),
          (state.error = null)
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload);
        state.message = null
      })
      .addCase(resetPassword.pending, (state) => {
        (state.loading = true),
        (state.error = null);
        (state.message = null)
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        (state.loading = false),
          (state.resetEmail = action.payload.email),
        (state.message = action.payload.message),
        (state.error = null)
      })
      .addCase(resetPassword.rejected, (state, action) => {
        (state.loading = false),
        (state.error = action.payload);
        state.message = null
      });
  },
});

export const { logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
