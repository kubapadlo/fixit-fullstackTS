import { Request, Response } from "express";
import { newFaultBody, updateStateBody } from "../types/fault.types";
import { createReadStream } from 'streamifier'
import { cloudinary } from "../config/cloudinary";
import multer, { FileFilterCallback } from 'multer';
import {prisma} from "../../lib/prisma"

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

    const foundUser = await prisma.user.findUnique({
      where: { id: userID }
    })
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

    const newFault = await prisma.fault.create({
      data: {
        reportedAt: new Date(),
        reportedById: userID!,
        category: formdata.category,
        description: formdata.description,
        state: formdata.state,
        imageURL,
        imageID
      }
    })

    return res.status(201).json({newFault, message: "New fault created"})
  } catch (error) {
    return res.status(500).json({message: "Sth went wrong while adding new fault", error})
  }
  
}

const showFaults = async (req: Request, res:Response) => {
  try {
    const userID = req.user?.userId;
    const foundUser = await prisma.user.findUnique({
      where: { id: userID }
    })
    if(!foundUser){
      return res.status(404).json({message: "User with this id does not exist!"})
    }

    const faults = await prisma.fault.findMany({
      where: { reportedById: userID }
    });

    return res.status(200).json({faults})
    
  } catch (error:any) {
       return res.status(500).json({message: "Cant show flaws " +  error.message})
  }
}

const getAllFaults = async (req: Request, res: Response) => {
  try {
    const faults = await prisma.fault.findMany({
      include: {
        reportedBy: {
          select: {
            firstName: true,
            lastName: true,
            dorm: true,  
            room: true   
          }
        }
      }
    });

    res.status(200).json(faults);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch faults" });
  }
};

const editFault = async (req: Request, res:Response) => {
  try {
    const {faultID} = req.params;
    const faultToUpdate = await prisma.fault.findUnique({
      where: { id: faultID }
    })

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

    const updatedFault = await prisma.fault.update({
      where: { 
        id: faultID,
        reportedById: req.user?.userId // zabezpieczenie ze tylko wlasciciel moze edytowac swoją usterke
      },
      data: newData
    });

    if(!updatedFault){
      return res.status(404).json({message: "Fault with this id doesnt not exist"})
    }

    return res.status(200).json({updatedFault, message: "Succesfuly updated a fault"})

  } catch (error) {
    return res.status(500).json({message: "Error while updating a fault"})
  }

}
// Request<Params, ResBody, ReqBody, Query>
const addReview = async (req: Request<{faultID:string},{},updateStateBody, {}>, res:Response) => {
  try {
    const {state, review} = req.body
    const {faultID} = req.params
    const technicianId = req.user!.userId;  // zapewniamy ts że to pole nie jest null
    
    const faultToReview = await prisma.fault.findUnique({
      where: { id: faultID }
    })
    
    if(!faultToReview){
      return res.status(404).json({message: "You dont have any faults with this id"})
    }

    if (faultToReview.assignedToId && faultToReview.assignedToId !== technicianId) {
      return res.status(403).json({ message: "Fault is assigned to another technician" });
    }

    if(faultToReview.state == 'reported' && state=="fixed" ){
      return res.status(404).json({message: "Firstly mark fault as asigned"})
    }

    if(faultToReview.state == 'fixed' && state != 'fixed'){
      return res.status(404).json({message: "You cant undo fixed faults"})
    }

    const updateData: any = {
      state: state
    }

    if (state === "assigned") {
      updateData.assignedToId = technicianId;
    }

    if (state === "fixed") {
      updateData.review = review ?? faultToReview.review;
    }

    const updatedFault = await prisma.fault.update({
      where: { id: faultID },
      data: updateData
    })

    return res.status(200).json({faultToReview: updatedFault, message:"Successfuly added a review"})

  } catch (error) {
      return res.status(500).json({message:"Error while adding a review"})
  } 

}

const deleteFault = async (req: Request<{faultID:string}>, res: Response) => {
  try {
    const { faultID } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const fault = await prisma.fault.findFirst({
      where: { id: faultID, reportedById: userId }
    });

    if (!fault) {
      return res.status(404).json({ message: "Fault not found" });
    }

    if (fault.state === "assigned" || fault.state === "fixed") {
      return res.status(403).json({
        message: `You can't delete ${fault.state} fault`
      });
    }

    await prisma.fault.delete({
      where: { id: faultID }
    });

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