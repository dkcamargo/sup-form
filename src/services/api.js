import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://api-form-sup.herokuapp.com"
      : process.env.REACT_APP_API_HOST
});

export default api;
