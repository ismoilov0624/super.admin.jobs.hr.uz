import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../../services/adminServices";

// Adminlarni olish
export const useAdmins = (params = {}) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => getAdmins(params),
    onError: (error) => {
      toast.error("Adminlarni yuklashda xatolik yuz berdi");
      console.error("Admins fetch error:", error);
    },
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    cacheTime: 10 * 60 * 1000, // 10 daqiqa
    retry: 3,
  });
};

// Admin yaratish
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin muvaffaqiyatli yaratildi!");
      console.log("Admin created:", data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Admin yaratishda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Create admin error:", error);
    },
  });
};

// Adminni yangilash
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAdmin(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin muvaffaqiyatli yangilandi!");
      console.log("Admin updated:", data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Adminni yangilashda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Update admin error:", error);
    },
  });
};

// Adminni o'chirish
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin muvaffaqiyatli o'chirildi!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Adminni o'chirishda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Delete admin error:", error);
    },
  });
};
