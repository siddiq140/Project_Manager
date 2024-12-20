import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
   cors({
      origin: "https://project-manager-ten-gamma.vercel.app",
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
      credentials: true,
   })
);

mongoose
   .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("Connected to MongoDB"))
   .catch((err) => console.log("Error connecting to MongoDB:", err));

// Server
const PORT = 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", userRoutes);
app.use("/api/project", projectRoutes);
