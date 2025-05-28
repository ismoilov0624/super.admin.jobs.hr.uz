import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getJobs } from "../../../services/jobServices";

// Ishlarni olish (faqat ko'rish uchun)
export const useJobs = (params = {}) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
    onError: (error) => {
      toast.error("Bo'sh ish o'rinlarini yuklashda xatolik yuz berdi");
      console.error("Jobs fetch error:", error);
    },
    // Ma'lumotlarni cache'da saqlash
    staleTime: 5 * 60 * 1000, // 5 daqiqa
    cacheTime: 10 * 60 * 1000, // 10 daqiqa
    retry: 3, // 3 marta qayta urinish
    // Default ma'lumotlar
    placeholderData: { data: { jobs: [], total: 0 } },
  });
};
