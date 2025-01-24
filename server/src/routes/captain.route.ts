import { Router } from "express";
import { verifyJWTForCaptain } from "../middlewares/auth.middleware";
import { getCaptainProfile, loginCaptain, logoutCaptain, refreshAccessToken, registerCaptain } from "../controllers/captain.controller";

const router:Router = Router()


router.route("/register").post(registerCaptain);
router.route("/login").post(loginCaptain);
router.route("/logout").post(verifyJWTForCaptain,logoutCaptain);
router.route("/profile").get(verifyJWTForCaptain,getCaptainProfile);
router.route("/refresh-token").post(verifyJWTForCaptain,refreshAccessToken);



export default router