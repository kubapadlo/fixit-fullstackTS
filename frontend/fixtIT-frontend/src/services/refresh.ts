import { api } from "../utils/api"
import type { User } from "../types/user.type"
import { isAxiosError } from "axios"

interface refreshResult {
    accessToken: string,
    user: User
}

export async function refresh(){
    try {
        const result = await api.get<refreshResult>('api/auth/refreshtoken')
        return result.data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error('Internal Server Error')
    }
}