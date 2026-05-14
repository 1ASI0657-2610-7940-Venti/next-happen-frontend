import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

export async function registerUserService(payload) {
  return axios.post(`${API_URL}/register`, payload);
}

export async function loginUserService(payload) {
  return axios.post(`${API_URL}/login`, payload);
}
