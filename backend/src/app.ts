import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

//routery
import authRouter from "./routers/authRoutes";
import userRouter from "./routers/userRouter";

// @ts-ignore
import { verifyJWT } from "./middleware/verifyJWT.js";
// @ts-ignore
import { verifyRole } from "./middleware/verifyRole.js";

const app = express();

const expo_client_url = process.env.EXPO_CLIENT_URL as string;

app.use(cors({
      origin: [
      "http://localhost:5173",      // front Vite
      "http://localhost:8081",  
      expo_client_url  // Expo dev na telefonie
    ],   
  credentials: true                   // jeśli używasz cookie lub sesji
}));

app.use(express.json());
app.use(cookieParser())


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get('/testPage', verifyJWT, verifyRole("admin", "user"), (req,res)=>{
    res.json({message: "Hello World"})
})

export default app;
