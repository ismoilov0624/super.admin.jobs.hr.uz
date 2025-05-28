import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const loginUser = async (credentials) => {
  const response = await request.post("/auth/super-admin/login", credentials);
  return response.data;
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Tokenlarni cookie'larga saqlash
      Cookies.set("user_token", data.data.accessToken, { expires: 1 }); // 1 kun
      Cookies.set("refresh_token", data.data.refreshToken, { expires: 7 }); // 7 kun

      // User ma'lumotlarini localStorage'ga saqlash
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          role: "SUPER_ADMIN",
          isAuthenticated: true,
        })
      );

      // Muvaffaqiyatli login xabari
      toast.success("Tizimga muvaffaqiyatli kirdingiz!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Dashboard'ga yo'naltirish
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

      console.log("Login successful:", data.message);
    },
    onError: (error) => {
      console.error("Login error:", error);

      // Xatolik xabarini ko'rsatish
      const errorMessage =
        error.response?.data?.message || "Login xatoligi yuz berdi";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
};
