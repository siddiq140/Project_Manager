import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch project count for the authenticated user
export const fetchProjectCount = createAsyncThunk(
   "project/fetchProjectCount",
   async (token, { rejectWithValue }) => {
      try {
         const response = await axios.get(
            "http://localhost:5000/api/project/project-count",
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         console.log(response.data);
         return response.data;
      } catch (error) {
         return rejectWithValue(error.response?.data || error.message);
      }
   }
);

const projectCountSlice = createSlice({
   name: "projectCount",
   initialState: {
      counts: {
         priorityCounts: [],
         statusCounts: [],
         dueDateCounts: {
            overdue: 0,
            dueToday: 0,
            dueThisWeek: 0,
            dueThisMonth: 0,
         },
      },
      status: "idle",
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchProjectCount.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchProjectCount.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.counts = action.payload;
         })
         .addCase(fetchProjectCount.rejected, (state, action) => {
            console.log(
               "fetchProjectCount rejected:",
               action.payload || action.error.message
            );
            state.status = "failed";
            state.error = action.payload || action.error.message;
         });
   },
});

export default projectCountSlice.reducer;
