import axios from 'axios';

const API_BASE_URL = "https://yumzo-food-deliveryy-a548.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
