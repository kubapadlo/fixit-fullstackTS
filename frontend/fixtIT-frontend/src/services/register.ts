import { isAxiosError } from "axios";
import { api } from "../utils/api";

interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location : {
    dorm: string,
    room: string
  };
}

interface RegisterResult{
    message: string
}

export default async function registerUser(params:RegisterRequestBody) {
    try {
        const res = await api.post<RegisterResult>('/api/auth/register', params)
        return res.data.message;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error('Wystąpił nieoczekiwany błąd');
    }
}