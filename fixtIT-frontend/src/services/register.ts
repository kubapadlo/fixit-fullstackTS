import { isAxiosError } from "axios";
import { api } from "../utils/api";
import { RegisterDTO, RegisterResponse } from "@shared/index";

export default async function registerUser(params:RegisterDTO) {
    try {
        const res = await api.post<RegisterResponse>('/api/auth/register', params)
        return res.data.message;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.message)
        }
        throw new Error('Wystąpił nieoczekiwany błąd');
    }
}