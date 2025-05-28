import { request } from "../config/request";

// Ishlarni olish (faqat ko'rish uchun)
export const getJobs = async (params = {}) => {
  const response = await request.get("/jobs", { params });
  return response.data;
};
