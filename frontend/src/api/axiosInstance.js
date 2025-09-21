import axios from "axios";

const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(sessionStorage.getItem("token")) || "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
// console.log(token,"accessToken");
// console.log(config,"config");
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;