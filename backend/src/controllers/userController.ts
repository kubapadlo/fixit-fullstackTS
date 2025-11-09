import { Request, Response } from "express";
import User from "../models/user.model";
import { newFaultBody } from "../types/fault.types";
import { Fault } from "../models/flaw.model";

interface AddFaultParams {
  userID: string;
}

const addFault = async (req: Request<AddFaultParams>, res: Response) => {
  try {
    const { userID } = req.params;

    const foundUser = await User.findById(userID);

    if(!foundUser){
      return res.status(404).json({message: "User with this id does not exist!"})
    }

    const faultData = req.body as newFaultBody;

    const newFault = await Fault.create({
        reportedAt: Date.now(),
        reportedBy: userID,
        description: faultData.description,
        state: faultData.state,
        review: faultData.review
    });

    return res.status(201).json({newFault, message: "Fault reported successfuly"});

    } catch (error:any) {
      return res.status(500).json({message: "Cant add flaw " +  error.message})
    }

};

const showFaults = async (req: Request, res:Response) => {
  try {
    const {userID} = req.params;
    const foundUser = await User.findById(userID)
        if(!foundUser){
      return res.status(404).json({message: "User with this id does not exist!"})
    }

    const faults = await Fault.find({reportedBy : userID})

    return res.status(200).json({faults})
    
  } catch (error:any) {
       return res.status(500).json({message: "Cant show flaws " +  error.message})
  }
}

export { addFault, showFaults };
