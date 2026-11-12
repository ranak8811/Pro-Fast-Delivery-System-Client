import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxios = (): AxiosInstance => {
  return axiosInstance;
};

export default useAxios;
