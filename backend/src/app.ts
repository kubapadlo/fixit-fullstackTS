import express from "express";
import authRouter from "./routers/authRoutes";
import cookieParser from "cookie-parser"

// @ts-ignore
import { verifyJWT } from "./middleware/verifyJWT.js";
// @ts-ignore
import { verifyRole } from "./middleware/verifyRole.js";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter);

app.get('/testPage', verifyJWT, verifyRole("admin", "user"), (req,res)=>{
    res.json({message: "Hello World"})
})

export default app;
