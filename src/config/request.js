import axios from "axios"
import Cookies from "js-cookie"

const request = axios.create({
  baseURL: "https://sahifam.uz",
})

request.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${Cookies.get("user_token")}`
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export { request }
