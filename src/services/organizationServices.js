import { request } from "../config/request";

// Tashkilotlarni olish
export const getOrganizations = async (params = {}) => {
  const response = await request.get("/organizations", { params });
  return response.data;
};

// Tashkilot yaratish
export const createOrganization = async (data) => {
  const response = await request.post("/organizations", data);
  return response.data;
};

// Tashkilotni yangilash
export const updateOrganization = async (id, data) => {
  const response = await request.put(`/organizations/${id}`, data);
  return response.data;
};

// Tashkilotni o'chirish
export const deleteOrganization = async (id) => {
  const response = await request.delete(`/organizations/${id}`);
  return response.data;
};

// Bitta tashkilotni olish
export const getOrganization = async (id) => {
  const response = await request.get(`/organizations/${id}`);
  return response.data;
};
