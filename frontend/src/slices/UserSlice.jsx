import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/Api";

export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
   const response = await API.get("/auth/get-user", {
      headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.user;
});

const userSlice = createSlice({
   name: "userData",
   initialState: { user: null, loading: false, error: null },
   reducers: {
      setUserData(state, action) {
         state.user = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchUser.pending, (state) => {
            state.loading = true;
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
         })
         .addCase(fetchUser.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false;
         });
   },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
