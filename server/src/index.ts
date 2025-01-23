import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import connectdb from "./db/db"
import { app } from "./app"


connectdb()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️ Server is running on http://localhost:${process.env.PORT}`)
        })
    })
    .catch((err:any)=>{
        console.log("Server is not running",err?.message)
    })