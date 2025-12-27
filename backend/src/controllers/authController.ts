// biblioteki
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// modele
import User from "../models/user.model";

// typy
import { LoginRequestBody, MyJwtPayload, RegisterRequestBody } from "../types/user.types";

// flagi
const debugMode = process.env.DEBUG_MODE === "true";

const register = async (req: Request, res: Response) => {
  try {
    const newUser = req.body as RegisterRequestBody;
    
    if (!newUser?.email || !newUser?.password || !newUser?.username) {
      return res.status(400).json({ message: "No user data in request body" });
    }

    const alreadyExists = await User.findOne({ email: newUser.email }); 
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    
    const createdUser = await User.create({
      username: newUser.username,
      email: newUser.email,
      passwordHash: hashedPassword,
      role: newUser.role, // optional
      location : newUser.location,  // optional
    });

    return res
      .status(201)
      .json({ createdUser, message: "User created successfuly" });
  } catch (error: any) {
    return res.status(500).json({ message: "Cant add user: " + error.message });
  }
};


const login = async(req: Request,res: Response)=>{
  try {
    console.log("Proba logowania")
    const loginData = req.body as LoginRequestBody

    if(!loginData.email || !loginData.password){
      return res.status(400).json({message: "Missing email or password in request body"})
    }

    const user = await User.findOne({email: loginData.email})
    if(!user){
      return res.status(404).json({message: "User not found, please login first"})
    }
    
    const isValid = await bcrypt.compare(loginData.password, user.passwordHash);

    if(!isValid){
      return res.status(401).json({message: "Wrong password"})
    }

    const accesToken = jwt.sign(
      { userId: user._id, role:user.role }, 
      process.env.SECRET_ACCESS_KEY as string, 
      { expiresIn: debugMode ? "5m" : "5m" } 
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username, role:user.role }, 
      process.env.SECRET_REFRESH_KEY as string, 
      { expiresIn: "15m" } 
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Niedostępne dla JavaScript, ochrona przed XSS
      maxAge: 15 * 1000 * 1000,
    });

    return res.status(200).json({user:{id: user._id, username: user.username, role:user.role}, accessToken: accesToken, message: "Logged sucessfuly"})
    
  } catch (error) {
    return res.status(500).json({message: "Server error while logging"})
  }
}

const refreshToken = async(req:Request, res:Response) => {
  try {
    const rtoken = req.cookies?.jwt;
  if (!rtoken){
    return res.status(401).json({message: "No refresh token in cookie"})
  }

  jwt.verify(rtoken, process.env.SECRET_REFRESH_KEY as string, (err:any, decoded:any)=>{
    if(err){
      return res.status(401).json({message: "Refresh token is not valid"})
    }
    const payload = decoded as MyJwtPayload;
    const newAccessToken = jwt.sign({userId: payload.userId, role: payload.role}, process.env.SECRET_ACCESS_KEY as string, { expiresIn: "5m" }  )

    return res.status(200).json({accessToken: newAccessToken, user:{id: payload.userId, username:payload.username, role: payload.role}})
  })
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"})
  }

};

const logout = (req:Request, res:Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
    });

    return res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500)
  }
};

export {register,login, refreshToken, logout}
