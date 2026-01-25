import { LoginResponse } from "@shared/index";
import { api } from "../utils/api"
import { isAxiosError } from "axios"

export async function refresh(){
    try {
        const result = await api.get<LoginResponse>('api/auth/refreshtoken')
        return result.data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error('Internal Server Error')
    }
}