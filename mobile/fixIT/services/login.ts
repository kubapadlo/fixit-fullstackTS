import {api} from '../utils/api'
import { isAxiosError } from "axios";
import type { User } from '../types/user.type';

interface loginResult{
    user: User,
    accessToken: string
}

interface logindata {
    email: string,
    password: string
}

export async function login({email, password}:logindata) {
    try {
        const result = await api.post<loginResult>('api/auth/login', {email, password})
        return result.data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error("Unexpected error")
    }
}