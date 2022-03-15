// Template for using Axios
import axios from 'axios';
axios.defaults.withCredentials = true;

const get = (url: string, config: object = {}) => {
  return axios.get(url, config);
};

const post = (url: string, obj: any, config: object = {}) => {
  return axios.post(url, obj, config);
};

const put = (url: string, obj: any, config: object = {}) => {
  return axios.put(url, obj, config);
};

const patch = (url: string, obj: any, config: object = {}) => {
  return axios.patch(url, obj, config);
};

const del = (url: string, config: object = {}) => {
  return axios.delete(url, config);
};

export default { get, post, put, patch, del };
