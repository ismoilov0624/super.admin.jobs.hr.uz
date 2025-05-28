import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "../../../services/organizationServices";

// Tashkilotlarni olish
export const useOrganizations = (params = {}) => {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => getOrganizations(params),
    onError: (error) => {
      toast.error("Tashkilotlarni yuklashda xatolik yuz berdi");
      console.error("Organizations fetch error:", error);
    },
    // Ma'lumotlarni cache'da saqlash
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    cacheTime: 10 * 60 * 1000, // 10 daqiqa
    retry: 3, // 3 marta qayta urinish
  });
};

// Tashkilot yaratish
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Tashkilot muvaffaqiyatli yaratildi!");
      console.log("Organization created:", data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Tashkilot yaratishda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Create organization error:", error);
    },
  });
};

// Tashkilotni yangilash
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateOrganization(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Tashkilot muvaffaqiyatli yangilandi!");
      console.log("Organization updated:", data);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Tashkilotni yangilashda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Update organization error:", error);
    },
  });
};

// Tashkilotni o'chirish
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Tashkilot muvaffaqiyatli o'chirildi!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Tashkilotni o'chirishda xatolik yuz berdi";
      toast.error(errorMessage);
      console.error("Delete organization error:", error);
    },
  });
};
