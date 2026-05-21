import axios from 'axios';

const api = axios.create({
  baseURL: 'https://active-edge-backend.onrender.com',
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

const getToken = async () => {
  if (tokenGetter) return tokenGetter();
  return null;
};

export default api;
