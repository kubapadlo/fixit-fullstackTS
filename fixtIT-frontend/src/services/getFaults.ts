import { isAxiosError } from 'axios'
import {api} from '../utils/api'
import { GetUserFaultsResponse } from '@shared/types/fault';

export default async function getFaults(){
    try {
        const res = await api.get<GetUserFaultsResponse>('/api/user/showFaults')
        return res.data.faults;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.message)
        }
        throw new Error('Internal server error')
    }
}