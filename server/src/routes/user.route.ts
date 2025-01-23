import { Router } from "express";
import { registerUser,loginUser, logoutUser } from "../controllers/user.controller";
import { verifyJWT } from "../midlewares/auth.middleware";

const router:Router = Router()


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);



export default router