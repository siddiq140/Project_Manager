import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API, { createTask, updateStatus } from "../services/Api";

const initialState = {
   projects: [],
   status: "idle",
   error: null,
};

// Fetch projects with a filter
export const fetchProjects = createAsyncThunk(
   "project/fetchProjects",
   async ({ filter, token }) => {
      const response = await API.get(`/project/get-projects/${filter}`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
   }
);

// Create a new project (task)
export const createProject = createAsyncThunk(
   "project/createProject",
   async ({ formData, token }, { dispatch }) => {
      const response = await createTask(formData, token);
      dispatch(addProject(response.data));
      return response.data;
   }
);

// Update project status
export const updateProjectStatus = createAsyncThunk(
   "project/updateProjectStatus",
   async ({ projectId, status }, { dispatch }) => {
      const response = await updateStatus(projectId, status);
      dispatch(updateProject(response?.data));
      return response.data;
   }
);

// Edit an existing project
export const editProject = createAsyncThunk(
   "project/editProject",
   async ({ projectId, updatedData }, { dispatch }) => {
      console.log(projectId);
      const response = await API.put(`/project/edit/${projectId}`, updatedData);
      dispatch(updateProject(response.data.project));
      return response.data.project;
   }
);

// Delete a project
export const deleteProject = createAsyncThunk(
   "project/deleteProject",
   async ({ projectId }, { dispatch }) => {
      await API.delete(`/project/delete/${projectId}`);
      dispatch(removeProject(projectId));
      return projectId;
   }
);

const projectSlice = createSlice({
   name: "project",
   initialState,
   reducers: {
      addProject(state, action) {
         state.projects.push(action.payload);
      },
      updateProject(state, action) {
         const updatedProject = action.payload;
         const existingProjectIndex = state.projects.findIndex(
            (project) => project._id === updatedProject._id
         );
         if (existingProjectIndex >= 0) {
            state.projects[existingProjectIndex] = updatedProject;
         }
      },
      removeProject(state, action) {
         state.projects = state.projects.filter(
            (project) => project._id !== action.payload
         );
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchProjects.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchProjects.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.projects = action.payload;
         })
         .addCase(fetchProjects.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
         })
         .addCase(updateProjectStatus.fulfilled, (state, action) => {
            const updatedProject = action.payload;
            const index = state.projects.findIndex(
               (project) => project._id === updatedProject._id
            );
            if (index >= 0) {
               state.projects[index] = updatedProject;
            }
         })
         .addCase(editProject.fulfilled, (state, action) => {
            const updatedProject = action.payload;
            const index = state.projects.findIndex(
               (project) => project._id === updatedProject._id
            );
            if (index >= 0) {
               state.projects[index] = updatedProject;
            }
         })
         .addCase(deleteProject.fulfilled, (state, action) => {
            state.projects = state.projects.filter(
               (project) => project._id !== action.payload
            );
         });
   },
});

export const { addProject, updateProject, removeProject } =
   projectSlice.actions;
export default projectSlice.reducer;
