import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const loginUser = (formData) => API.post("/auth/login", formData);
export const registerUser = (formData) => API.post("/auth/signup", formData);
export const createTask = (formData, token) =>
   API.post("/project/create-project", formData, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

export const fetchUser = () => API.get("/auth/user-email");

export const updateUser = (formData, token) =>
   API.put(`/auth/update-user`, formData, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

export const updateChecklist = (projectId, taskIndex, isDone) => {
   API.put("/project/done-checklist", {
      projectId,
      taskIndex,
      isDone,
   });
};

export const updateStatus = (projectId, status) => {
   return API.put(`/project/project-status/${projectId}`, {
      status,
   });
};

export const fetchProjectById = async (projectId) => {
   return await API.get(`/project/project/${projectId}`);
};
export default API;
