import { Router } from "express";
import { registerUser,loginUser, logoutUser, getUserProfile, refreshAccessToken } from "../controllers/user.controller";
import { verifyJWTForUser } from "../middlewares/auth.middleware";

const router:Router = Router()


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWTForUser,logoutUser);
router.route("/profile").get(verifyJWTForUser,getUserProfile);
router.route("/refresh-token").get(verifyJWTForUser,refreshAccessToken)



export default router