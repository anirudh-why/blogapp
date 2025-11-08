import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosWithToken } from "../../axiosWithToken";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    if (serializedState === null) {
      return {
        isPending: false,
        loginUserStatus: false,
        currentUser: {},
        errorOccurred: false,
        errMsg: ''
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      isPending: false,
      loginUserStatus: false,
      currentUser: {},
      errorOccurred: false,
      errMsg: ''
    };
  }
};

// Verify token and restore session
export const verifyTokenThunk = createAsyncThunk("verify-token", async (_, thunkApi) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return thunkApi.rejectWithValue('No token found');
    }

    // Call backend to verify token is still valid
    const res = await axiosWithToken.get(`${window.location.origin}/common-api/verify-token`);
    
    if (res.data.message === "Token valid") {
      return {
        message: "Token valid",
        user: res.data.user
      };
    } else {
      return thunkApi.rejectWithValue('Token validation failed');
    }
  } catch (err) {
    // Clear invalid token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userState');
    return thunkApi.rejectWithValue(err.response?.data?.message || err.message);
  }
});

//make http req using redux-thunk middleware
export const userAuthorLoginThunk = createAsyncThunk("user-author-login", async (userCred, thunkApi) => {
  try {
    if (userCred.usertype === "user") {
      const res = await axios.post(
        `${window.location.origin}/user-api/login`,
        userCred
      );
      
      if (res.data.message === "login success") {
        //store token in local/session storage
        localStorage.setItem("token", res.data.token);
        
        // Create user state object
        const userState = {
          isPending: false,
          currentUser: {
            username: res.data.user.username,
            usertype: "user",
            email: res.data.user.email
          },
          loginUserStatus: true,
          errorOccurred: false,
          errMsg: ''
        };
        
        // Store user state in localStorage
        localStorage.setItem('userState', JSON.stringify(userState));
        
        return {
          message: "login success",
          token: res.data.token,
          user: userState.currentUser
        };
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    }
    if (userCred.usertype === "author") {
      const res = await axios.post(
        `${window.location.origin}/author-api/login`,
        userCred
      );
      
      if (res.data.message === "login success") {
        //store token in local/session storage
        localStorage.setItem("token", res.data.token);
        
        // Create user state object
        const userState = {
          isPending: false,
          currentUser: {
            username: res.data.user.username,
            usertype: "author",
            email: res.data.user.email
          },
          loginUserStatus: true,
          errorOccurred: false,
          errMsg: ''
        };
        
        // Store user state in localStorage
        localStorage.setItem('userState', JSON.stringify(userState));
        
        return {
          message: "login success",
          token: res.data.token,
          user: userState.currentUser
        };
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    }
  } catch (err) {
    return thunkApi.rejectWithValue("An error occurred. Please try again.");
  }
});

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: loadState(),
  reducers: {
    resetState: (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false;
      state.errMsg = '';
      // Clear localStorage when logging out
      localStorage.removeItem('userState');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.errorOccurred = false;
      state.errMsg = '';
    }
  },
  extraReducers: builder => builder
    // Handle token verification
    .addCase(verifyTokenThunk.pending, (state) => {
      state.isPending = true;
      state.errorOccurred = false;
      state.errMsg = '';
    })
    .addCase(verifyTokenThunk.fulfilled, (state, action) => {
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errorOccurred = false;
      state.errMsg = '';
    })
    .addCase(verifyTokenThunk.rejected, (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false; // Don't show error for token verification failure
      state.errMsg = '';
      // Clear localStorage on token verification failure
      localStorage.removeItem('userState');
      localStorage.removeItem('token');
    })
    // Handle login
    .addCase(userAuthorLoginThunk.pending, (state) => {
      state.isPending = true;
      state.errorOccurred = false;
      state.errMsg = '';
    })
    .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errMsg = '';
      state.errorOccurred = false;
    })
    .addCase(userAuthorLoginThunk.rejected, (state, action) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errMsg = action.payload;
      state.errorOccurred = true;
      // Clear localStorage on login failure
      localStorage.removeItem('userState');
    }),
});

//export action creator functions
export const { resetState, clearError } = userAuthorSlice.actions;
//export root reducer of this slice
export default userAuthorSlice.reducer;