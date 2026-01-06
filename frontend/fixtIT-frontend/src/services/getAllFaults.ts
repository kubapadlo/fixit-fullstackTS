import { isAxiosError } from 'axios'
import {api} from '../utils/api'

import type { FaultWithUserObject } from '../types/fault.type';

export default async function getAllFaults(){
    try {
        const res = await api.get<FaultWithUserObject[]>('/api/user/getAllFaults')
        return res.data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.message)
        }
        throw new Error('Internal server error')
    }
}