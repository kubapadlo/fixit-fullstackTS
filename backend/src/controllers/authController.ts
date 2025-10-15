// biblioteki
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// modele
import User from "../models/user.model";

// typy
import { RegisterRequestBody } from "../types/user.types";

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
        .json({ message: "User with this email already exist" });
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const createdUser = await User.create({
      username: newUser.username,
      email: newUser.email,
      passwordHash: hashedPassword,
    });

    return res
      .status(201)
      .json({ createdUser, message: "User created successfuly" });
  } catch (error: any) {
    return res.status(500).json({ message: "Cant add user: " + error.message });
  }
};

export default register
