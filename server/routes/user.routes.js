import express from "express";
import {
  loginUser,
  myProfile,
  registerUser,
  verifyUser,
} from "../contollers/user.controllers.js";
import { isAuth } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);

export default router;
