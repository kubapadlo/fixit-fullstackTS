import { api } from "../utils/api"
import { isAxiosError } from "axios"


export async function logout(){
    try {
        await api.get('api/auth/logout')
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error('Internal Server Error')
    }
}
