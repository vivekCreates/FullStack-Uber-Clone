import express,{Request,Response} from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("/public"))

app.use(cors())
app.use(cookieParser())



//import routes
import userRoutes from "./routes/user.route"

// routes declaration
app.use("/api/v1/user",userRoutes)

export {app}