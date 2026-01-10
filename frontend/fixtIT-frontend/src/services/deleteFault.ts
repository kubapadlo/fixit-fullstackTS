import { isAxiosError } from "axios";
import { api } from "../utils/api";

export default async function deleteFault( faultID : string){
    try {
        const data = await api.delete(`/api/user/${faultID}/delete`);
        return data;
    } catch (error:any) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error(error.message)
    }
}