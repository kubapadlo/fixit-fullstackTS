import { Request, Response } from "express";
import User from "../models/user.model";
import { newFaultBody } from "../types/fault.types";
import { Fault } from "../models/flaw.model";
import {createReadStream} from 'streamifier'
import { cloudinary } from "../config/cloudinary";
import multer, {FileFilterCallback} from 'multer';

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

//pomocniczna
const uploadToCloudinary = (filebuffer: Buffer) : Promise<string|undefined> =>{

  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream({ folder: "fixIT_uploads" }, (err, upload_data)=>{
      if(err) return reject(err)
      
      resolve(upload_data?.secure_url)
    })
    createReadStream(filebuffer).pipe(upload_stream);
  })
  
}

const addFault = async(req:Request<{},{}, newFaultBody>, res:Response) => {
  try {
    const userID = req.user?.userId;

  const foundUser = User.findById(userID)
  if(!foundUser){
    return res.status(404).json({message: "User with this id doesnt exist!"})
  }

  const formdata = req.body;
  let imageUrl = "" as string|undefined;

  if(req.file){
    try {
      imageUrl = await uploadToCloudinary(req.file.buffer)
    } catch (error) {
      return res.status(500).json("Error while uploading a file " + error)
    }
  }

  const newFault = await Fault.create({
    reportedAt: Date.now(),
    reportedBy: userID,
    description: formdata.description,
    state: formdata.state,
    review: formdata.review,
    image: imageUrl
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



export { addFault, showFaults };
