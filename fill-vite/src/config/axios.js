import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_ENDPOINT_URL;

export default axios;
