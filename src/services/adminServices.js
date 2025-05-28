import { request } from "../config/request";

// Adminlarni olish
export const getAdmins = async (params = {}) => {
  const response = await request.get("/admins", { params });
  return response.data;
};

// Admin yaratish
export const createAdmin = async (data) => {
  const response = await request.post("/admins", data);
  return response.data;
};

// Adminni yangilash
export const updateAdmin = async (id, data) => {
  const response = await request.put(`/admins/${id}`, data);
  return response.data;
};

// Adminni o'chirish
export const deleteAdmin = async (id) => {
  const response = await request.delete(`/admins/${id}`);
  return response.data;
};

// Bitta adminni olish
export const getAdmin = async (id) => {
  const response = await request.get(`/admins/${id}`);
  return response.data;
};
