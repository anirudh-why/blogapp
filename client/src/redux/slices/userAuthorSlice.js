
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//make http req using redux-thunk middleware
export const userAuthorLoginThunk=createAsyncThunk("user-author-login", async (userCred, thunkApi) => {
  try {
    if (userCred.usertype === "user") {
      const res = await axios.post(
        "http://localhost:4000/user-api/login",
        userCred
      );
      if (res.data.message === "login success") {
        //store token in local/session storage
        localStorage.setItem("token", res.data.token);

        //return data
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
      return res.data;
    }
    if (userCred.usertype === "author") {
      const res = await axios.post(
        "http://localhost:4000/author-api/login",
        userCred
      );
      if (res.data.message === "login success") {
        //store token in local/session storage
        localStorage.setItem("token", res.data.token);
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
      return res.data;
    }
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

export const userAuthorSlice = createSlice({
  name: "user-author-login",
  initialState: {
    isPending:false,
    loginUserStatus:false,
    currentUser:{},
    errorOccurred:false,
    errMsg:''
  },
  reducers: {
    resetState:(state,action)=>{
        state.isPending=false;
        state.currentUser={};
        state.loginUserStatus=false;
        state.errorOccurred=false;
        state.errMsg=''
    }
  },
  extraReducers: builder=>builder
  .addCase(userAuthorLoginThunk.pending,(state,action)=>{
    state.isPending=true;
  })
  .addCase(userAuthorLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.user;
        state.loginUserStatus=true;
        state.errMsg=''
        state.errorOccurred=false;

  })
  .addCase(userAuthorLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser={};
        state.loginUserStatus=false;
        state.errMsg=action.payload;
        state.errorOccurred=true;
  }),
});

//export action creator functions
export const {resetState} = userAuthorSlice.actions;
//export root reducer of this slice
export default userAuthorSlice.reducer;