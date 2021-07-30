import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://vlq8l.sse.codesandbox.io"
      : process.env.herokuURL
});

export default api;
