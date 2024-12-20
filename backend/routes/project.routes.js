import express from "express";
import { verifyUser } from "../helpers/authentication.js";
import {
   createProject,
   filterProjects,
   getProjectCounts,
   deleteProject,
   updateProjectStatus,
   markChecklistAsDone,
   getProject,
   editProject,
} from "../controller/project.controller.js";

const router = express.Router();

router.get("/get-projects/:filter", verifyUser, filterProjects);
router.get("/project/:id", getProject);
router.get("/project-count", verifyUser, getProjectCounts);
router.post("/create-project", verifyUser, createProject);
router.put("/done-checklist", markChecklistAsDone);
router.put("/project-status/:projectId", updateProjectStatus);
router.put("/edit/:projectId", editProject);
router.delete("/delete/:projectId", deleteProject);

export default router;
