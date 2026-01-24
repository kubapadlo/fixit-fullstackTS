import { isAxiosError } from 'axios';
import { api } from '../utils/api';

interface addFaultParms {
    category: string;
    description: string;
    image?: File;
}

export async function addFault({ category, description, image }: addFaultParms) {
    try {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("description", description); 
        if(image){
            formData.append("image", image);
        }
    
        const res = await api.post('/api/user/addFault',formData, {headers: {'Content-Type': 'multipart/form-data'}});
        return res.data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response && error.response.data) {
                if (error.response.data.message === "Validation error" && Array.isArray(error.response.data.errors)) {
                    throw new Error(error.response.data.errors.join(', '));
                }
                if (error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
            throw new Error(error.message);
        }
        throw new Error('Wystąpił nieoczekiwany błąd');
    }
}