import { isAxiosError } from "axios";
import { api } from "../utils/api";
import { AddReviewDTO, AddReviewResponse } from "@shared/index";

export async function updateFaultStatus(faultID: string, data: AddReviewDTO){
  try {
    await api.put<AddReviewResponse>(`/api/user/${faultID}/review`, data);
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Could not update fault');
  }
}