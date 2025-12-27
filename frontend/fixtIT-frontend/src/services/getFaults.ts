import { isAxiosError } from 'axios'
import {api} from '../utils/api'

import type { Fault } from '../types/fault.type';

export interface FaultsResponse {
  faults: Fault[];
}

export default async function getFaults(){
    try {
        const res = await api.get<FaultsResponse>('/api/user/showFaults')
        return res.data.faults;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.message)
        }
        throw new Error('Internal server error')
    }
}