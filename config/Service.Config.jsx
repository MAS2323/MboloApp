// import axios from "axios";
// export const API_BASE_URL =
//   process.env.API_BASE_URL || "https://mbolo-backend.onrender.com";

// export const api = axios.create({
//   baseURL: process.env.API_BASE_URL || "https://mbolo-backend.onrender.com", // Cambia esto por la URL de tu backend
// });

import axios from "axios";
export const API_BASE_URL = "http://10.15.122.126:3000";

export const api = axios.create({
  baseURL: "http://169.254.192.108:3000", // Cambia esto por la URL de tu backend
});
