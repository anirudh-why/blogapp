import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosWithToken } from "../../axiosWithToken";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    console.log('Loading state from localStorage:', serializedState);
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
    console.error('Error loading state:', err);
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
    const userState = localStorage.getItem('userState');
    console.log('Verifying token. Token:', token);
    console.log('User state from localStorage:', userState);
    
    if (!token || !userState) {
      return thunkApi.rejectWithValue('No token or user state found');
    }

    // Parse the stored user state
    const parsedState = JSON.parse(userState);
    console.log('Parsed user state:', parsedState);
    
    if (!parsedState.currentUser || !parsedState.currentUser.username) {
      return thunkApi.rejectWithValue('Invalid user state');
    }

    // Return the stored user data
    return {
      message: "profile found",
      user: parsedState.currentUser
    };
  } catch (err) {
    console.error('Error in verifyTokenThunk:', err);
    return thunkApi.rejectWithValue(err.message);
  }
});

//make http req using redux-thunk middleware
export const userAuthorLoginThunk = createAsyncThunk("user-author-login", async (userCred, thunkApi) => {
  try {
    console.log('Login attempt with credentials:', userCred);
    
    if (userCred.usertype === "user") {
      const res = await axios.post(
        `${window.location.origin}/user-api/login`,
        userCred
      );
      console.log('Login response:', res.data);
      
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
        console.log('Stored user state:', userState);
        
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
      console.log('Login response:', res.data);
      
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
        console.log('Stored user state:', userState);
        
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
    console.error('Login error:', err);
    return thunkApi.rejectWithValue(err);
  }
});

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: loadState(),
  reducers: {
    resetState: (state, action) => {
      console.log('Resetting state');
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false;
      state.errMsg = '';
      // Clear localStorage when logging out
      localStorage.removeItem('userState');
      localStorage.removeItem('token');
    }
  },
  extraReducers: builder => builder
    // Handle token verification
    .addCase(verifyTokenThunk.pending, (state) => {
      state.isPending = true;
    })
    .addCase(verifyTokenThunk.fulfilled, (state, action) => {
      console.log('Token verification successful:', action.payload);
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errorOccurred = false;
      state.errMsg = '';
    })
    .addCase(verifyTokenThunk.rejected, (state, action) => {
      console.log('Token verification failed:', action.payload);
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = true;
      state.errMsg = action.payload;
      // Clear localStorage on token verification failure
      localStorage.removeItem('userState');
      localStorage.removeItem('token');
    })
    // Handle login
    .addCase(userAuthorLoginThunk.pending, (state) => {
      state.isPending = true;
    })
    .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
      console.log('Login successful, updating state with:', action.payload);
      state.isPending = false;
      state.currentUser = action.payload.user;
      state.loginUserStatus = true;
      state.errMsg = '';
      state.errorOccurred = false;
    })
    .addCase(userAuthorLoginThunk.rejected, (state, action) => {
      console.log('Login failed:', action.payload);
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
export const { resetState } = userAuthorSlice.actions;
//export root reducer of this slice
export default userAuthorSlice.reducer;