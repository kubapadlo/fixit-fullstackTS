import {api} from '../utils/api'
import { isAxiosError } from "axios";

type User = {
    id: string,
    username: string,
    role:string
}

interface logindata {
    email: string,
    password: string
}

interface loginresult{
    accesstoken: string,
    user: User
}

export async function login({email, password}:logindata) {
    try {
        const result = await api.post<loginresult>('api/auth/login', {email, password})
        console.log(result.data)
        return result.data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error("Unexpected error")
    }
}