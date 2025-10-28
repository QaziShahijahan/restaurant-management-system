import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change if server runs elsewhere
  timeout: 10000
});

export default api;
