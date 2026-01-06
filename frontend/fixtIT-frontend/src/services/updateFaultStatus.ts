import { isAxiosError } from "axios";
import { api } from "../utils/api";

export interface UpdateFaultParams {
  id: string;
  state: 'reported' | 'assigned' | 'fixed';
  review: string;
}

export async function updateFaultStatus({ id, state, review }: UpdateFaultParams): Promise<void> {
  try {
    await api.put(`/api/user/${id}/review`, { state, review });
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Could not update fault');
  }
}