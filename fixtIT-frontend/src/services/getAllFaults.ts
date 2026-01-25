import { isAxiosError } from 'axios'
import {api} from '../utils/api'
import { GetUserFaultsResponse } from '@shared/types/fault';
import { mapFaultFromApi } from "../mappers/faultMapper";

export default async function getAllFaults(){
    try {
        const res = await api.get<GetUserFaultsResponse>('/api/user/getAllFaults')
        return res.data.faults.map(mapFaultFromApi);
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.message)
        }
        throw new Error('Internal server error')
    }
}