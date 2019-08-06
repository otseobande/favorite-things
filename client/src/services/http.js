import axios from 'axios';
import toast from 'toast-me';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Network error
    if (!error.response) {
      toast('Network error! Please check your internet connection.', 'error');
    }

    return Promise.reject(error);
  }
);
export default axios
