import express from "express";
import {
   login,
   signup,
   getAllUserEmails,
   updateUser,
   getUser,
} from "../controller/user.controller.js";
import { verifyUser } from "../helpers/authentication.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-email", getAllUserEmails);
router.get("/get-user", verifyUser, getUser);
router.put("/update-user", verifyUser, updateUser);

export default router;
