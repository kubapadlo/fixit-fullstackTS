import {api} from '../utils/api'
import { isAxiosError } from "axios";
import { LoginDTO, LoginResponse } from "@shared/types/user";

export async function login(credentials: LoginDTO): Promise<LoginResponse> {
    try {
        const result = await api.post<LoginResponse>('api/auth/login', credentials);
        return result.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message || "Login failed");
        }
        throw new Error("Unexpected error");
    }
}