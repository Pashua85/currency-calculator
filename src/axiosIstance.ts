import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://awx.pro/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Serial': 'a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa'
  },
});

export default axiosInstance;