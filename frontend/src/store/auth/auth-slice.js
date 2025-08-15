import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, confirmPassword }, thunkAPI) => {
    try {
      const result = await API.post("auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verify = createAsyncThunk(
  "auth/verify",
  async ({ otp, email }, thunkAPI) => {
    try {
      const result = await API.post("auth/verifyRegister", { otp, email });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const result = await API.post("auth/login", { email, password });
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Login"
      );
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const result = await API.post("auth/logout");
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to LogOut"
    );
  }
});

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const result = await API.get("auth/me");
    return result.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to load user"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isBootstrapped: false,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register user
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // verify user
      .addCase(verify.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(verify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // login user
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // logout user
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload.message;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      // getUser thunk (bootstrap on app start)
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isBootstrapped = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isBootstrapped = true;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
