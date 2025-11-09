import express from "express";
import cookieParser from "cookie-parser"

//routery
import authRouter from "./routers/authRoutes";
import userRouter from "./routers/userRouter";

// @ts-ignore
import { verifyJWT } from "./middleware/verifyJWT.js";
// @ts-ignore
import { verifyRole } from "./middleware/verifyRole.js";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get('/testPage', verifyJWT, verifyRole("admin", "user"), (req,res)=>{
    res.json({message: "Hello World"})
})

export default app;
