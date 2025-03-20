import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5173/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Serial: 'a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa',
  },
});

export default axiosInstance;
