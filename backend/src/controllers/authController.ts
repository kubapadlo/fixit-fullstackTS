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
    
    if (!newUser?.email || !newUser?.password || !newUser?.firstName || !newUser?.lastName) {
      return res.status(400).json({ message: "No user data in request body" });
    }

    const alreadyExists = await User.findOne({ email: newUser.email }); 
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // 2. Sprawdzenie, ile osób ma już zarejestrowaną tę lokalizację
    const usersInLocationCount = await User.countDocuments({ location: newUser.location });

    if (usersInLocationCount >= 2) { // Jeśli już 2 lub więcej użytkowników ma tę lokalizację
      return res
        .status(400)
        .json({ message: `Pokój ${newUser.location.dorm} ${newUser.location.room} został już przypisany do maksymalnej liczby osób(2). Skontaktuj się z administratorem.` });
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    
    const createdUser = await User.create({
      email: newUser.email,
      passwordHash: hashedPassword,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: "student", // optional
      location : newUser.location, 
    });

    return res
      .status(201)
      .json({ message: "User created successfuly" });
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
      return res.status(404).json({message: "User not found, please register first"})
    }

    const isValid = await bcrypt.compare(loginData.password, user.passwordHash);

    if(!isValid){
      return res.status(401).json({message: "Wrong password"})
    }

    const accesToken = jwt.sign(
      { userId: user._id, role:user.role }, 
      process.env.SECRET_ACCESS_KEY as string, 
      { expiresIn: debugMode ? "1m" : "1m" } 
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role:user.role }, 
      process.env.SECRET_REFRESH_KEY as string, 
      { expiresIn: "30m" } 
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Niedostępne dla JavaScript, ochrona przed XSS
      maxAge: 15 * 1000 * 1000,
    });
      
    return res.status(200).json({user:{id: user._id, role:user.role, fullName: `${user.firstName} ${user.lastName}`}, accessToken: accesToken, message: "Logged sucessfuly"})
    
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

  jwt.verify(rtoken, process.env.SECRET_REFRESH_KEY as string, async(err:any, decoded:any)=>{
    if(err){
      return res.status(401).json({message: "Refresh token is not valid"})
    }
    const payload = decoded as MyJwtPayload;
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = jwt.sign({userId: payload.userId, role: payload.role}, process.env.SECRET_ACCESS_KEY as string, { expiresIn: "1m" }  )

    return res.status(200).json({accessToken: newAccessToken, user:{id: payload.userId, role: payload.role, fullName: `${user.firstName} ${user.lastName}`}})
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
