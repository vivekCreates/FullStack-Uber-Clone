import {Router} from "express"
import { verifyJWTForUser } from "../middlewares/auth.middleware";
import { getCoordinates, getSuggestedPlaces } from "../controllers/map.controller";

const router:Router = Router();

router.route("/get-coordinates").get(verifyJWTForUser,getCoordinates)
router.route("/get-suggested-places").get(verifyJWTForUser,getSuggestedPlaces)


export default router