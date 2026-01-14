import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../../lib/prisma" 
import { LoginRequestBody, MyJwtPayload, RegisterRequestBody } from "../types/user.types";

const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
    const newUser = req.body;

    if (!newUser?.email || !newUser?.password || !newUser?.firstName || !newUser?.lastName) {
      return res.status(400).json({ message: "No user data in request body" });
    }

    const alreadyExists = await prisma.user.findUnique({
      where: { email: newUser.email }
    });
  
    if (alreadyExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    const usersInLocationCount = await prisma.user.count({
        where: {
          dorm: newUser.location.dorm,
          room: newUser.location.room
        }
      });

      if (usersInLocationCount >= 2) {
        return res.status(400).json({
          message: `Pokój ${newUser.location.dorm} ${newUser.location.room} został już przypisany do maksymalnej liczby osób(2).`
        });
      }
    

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    await prisma.user.create({
      data: {
        email: newUser.email,
        passwordHash: hashedPassword,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: "student",
        dorm: newUser.location?.dorm,
        room: newUser.location?.room
      }
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Cant add user: " + error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const loginData = req.body as LoginRequestBody;

    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found, please register first" });
    }

    const isValid = await bcrypt.compare(loginData.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET_ACCESS_KEY as string,
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET_REFRESH_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1 * 60 * 1000,  // minuta
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: { id: user.id, role: user.role, fullName: `${user.firstName} ${user.lastName}` },
      message: "Logged successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while logging" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const rtoken = req.cookies?.refreshToken;
    if (!rtoken) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(rtoken, process.env.SECRET_REFRESH_KEY as string, async (err: any, decoded: any) => {
      if (err) return res.status(401).json({ message: "Invalid refresh token" });

      const payload = decoded as MyJwtPayload;
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.SECRET_ACCESS_KEY as string,
        { expiresIn: "1m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1 * 60 * 1000,  // minuta
    });

      return res.status(200).json({
        user: { id: user.id, role: user.role, fullName: `${user.firstName} ${user.lastName}` }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", { httpOnly: true });
  return res.sendStatus(204);
};

export { register, login, refreshToken, logout };