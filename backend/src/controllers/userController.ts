import { Request, Response, urlencoded } from "express";
import User from "../models/user.model";
import { newFaultBody, updateStateBody } from "../types/fault.types";
import { Fault } from "../models/fault.model";
import {createReadStream} from 'streamifier'
import { cloudinary } from "../config/cloudinary";
import multer, {FileFilterCallback} from 'multer';
import { set } from "mongoose";
import { string } from "joi";

// --------------- MULTER -------------------
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);  // akceptujemy plik
  } else {
    cb(new Error('Invalid file format')); // odrzucamy plik - multer wyrzuci next(error)
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('image')

// ------------------------------------------

//pomocniczna
const uploadToCloudinary = (filebuffer: Buffer) : Promise<{ url: string|undefined; id: string|undefined }> =>{

  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream({ folder: "fixIT_uploads" }, (err, upload_data)=>{
      if(err) return reject(err)
      
      resolve({url:upload_data?.secure_url, id:upload_data?.public_id})
    })
    createReadStream(filebuffer).pipe(upload_stream);
  })
  
}

const addFault = async(req:Request<{},{}, newFaultBody>, res:Response) => {
  try {
    const userID = req.user?.userId;

    const foundUser = await User.findById(userID)
    if(!foundUser){
      return res.status(404).json({message: "User with this id doesnt exist!"})
    }

    const formdata = req.body;
    let imageURL, imageID = "" as string|undefined;
    
    if(req.file){
      try {
        const {url,id} = await uploadToCloudinary(req.file.buffer)
        imageURL = url;
        imageID = id;
      } catch (error) {
        return res.status(500).json("Error while uploading a file " + error)
      }
    }

    console.log(req.body)

    const newFault = await Fault.create({
      reportedAt: Date.now(),
      reportedBy: userID,
      category: formdata.category,
      description: formdata.description,
      state: formdata.state,
      imageURL,
      imageID
    })

    return res.status(201).json({newFault, message: "New fault created"})
  } catch (error) {
    return res.status(500).json({message: "Sth went wrong while adding new fault", error})
  }
  
}

const showFaults = async (req: Request, res:Response) => {
  try {
    const userID = req.user?.userId;
    const foundUser = await User.findById(userID)
    if(!foundUser){
      return res.status(404).json({message: "User with this id does not exist!"})
    }

    const faults = await Fault.find({reportedBy : userID});

    return res.status(200).json({faults})
    
  } catch (error:any) {
       return res.status(500).json({message: "Cant show flaws " +  error.message})
  }
}

const getAllFaults = async (req: Request, res: Response) => {
  try {
    const faults = await Fault.find()
      .populate({
        path: "reportedBy",
        select: "firstName lastName location"
      });

    res.status(200).json(faults);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch faults" });
  }
};

const editFault = async (req: Request, res:Response) => {
  try {
    const {faultID} = req.params;
    const faultToUpdate = await Fault.findById(faultID)

    const newData: { description?: string; imageURL?: string; imageID?: string } = {};
    newData.description = req.body?.description;

    if(req.file){
      try {
        // jeśli istnieje stare zdjęcie, usuń je
        if (faultToUpdate?.imageID) {
          await cloudinary.uploader.destroy(faultToUpdate.imageID);
        }

        const {url, id} = await uploadToCloudinary(req.file.buffer) 
        newData.imageURL = url
        newData.imageID = id;
      } catch (error) {
        return res.status(500).json({message:"Error upload file to cloudinary"})
      }
    }

    const updatedFault = await Fault.findOneAndUpdate(
      { _id: faultID, reportedBy: req.user?.userId }, // zabezpieczenie ze tylko wlasciciel moze edytowac swoją usterke
      { $set: newData },
      { new: true }
    );

    if(!updatedFault){
      return res.status(404).json({message: "Fault with this id doesnt not exist"})
    }

    return res.status(200).json({updatedFault, message: "Succesfuly updated a fault"})

  } catch (error) {
    return res.status(500).json({message: "Error while updating a fault"})
  }

}

const addReview = async (req: Request<{faultID:string},{},updateStateBody>, res:Response) => {
  try {
    const {state, review} = req.body
    const {faultID} = req.params
    const technicianId = req.user!.userId;
    
    const faultToReview = await Fault.findById(faultID)
    
    if(!faultToReview){
      return res.status(404).json({message: "You dont have any faults with this id"})
    }

    if (faultToReview.assignedTo && faultToReview.assignedTo.toString() !== technicianId) {
      return res.status(403).json({ message: "Fault is assigned to another technician" });
    }

    if(faultToReview.state == 'reported' && state=="fixed" ){
      return res.status(404).json({message: "Firstly mark fault as asigned"})
    }

    if(faultToReview.state == 'fixed' && state != 'fixed'){
      return res.status(404).json({message: "You cant undo fixed faults"})
    }

    if (state === "assigned") {
      faultToReview.assignedTo = technicianId;
    }

    if (state === "fixed") {
      faultToReview.review = review ?? faultToReview.review;
    }

    faultToReview.state = state;
    await faultToReview.save();

    return res.status(200).json({faultToReview, message:"Successfuly added a review"})

  } catch (error) {
      return res.status(500).json({message:"Error while adding a review"})
  } 

}

const deleteFault = async (req: Request, res: Response) => {
  try {
    const { faultID } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const fault = await Fault.findOne({ _id: faultID, reportedBy: userId });

    if (!fault) {
      return res.status(404).json({ message: "Fault not found or not authorized to delete" });
    }

    if (fault.state === "assigned" || fault.state === "fixed") {
      return res.status(403).json({
        message: `You can't delete ${fault.state} fault`
      });
    }

    await Fault.deleteOne({ _id: faultID });

    if (fault.imageID) {
      await cloudinary.uploader.destroy(fault.imageID);
    }

    return res.status(200).json({
      message: `Fault with ID ${faultID} deleted successfully`,
      deletedFault: fault
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while deleting a fault" });
  }
};

export { addFault, showFaults, getAllFaults, editFault, addReview, deleteFault};
