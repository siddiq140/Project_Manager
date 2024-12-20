import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/ProjectSlice";
import projectCountReducer from "./slices/ProjectCountSlice";
import userReducer from "./slices/UserSlice";

export const store = configureStore({
   reducer: {
      project: projectReducer,
      projectCount: projectCountReducer,
      userData: userReducer,
   },
});
