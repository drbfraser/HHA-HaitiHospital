import axios from 'axios';
import * as Error from './ApiError';
import { toast } from 'react-toastify';

export const get = (url: string): Promise<string> => {
  return axios
    .get(url, {
      responseType: 'blob',
    })
    .then((response: any) => {
      return URL.createObjectURL(response.data);
    })
    .catch(() => {
      toast.error('Unable to fetch image');
      return Error.DEFAULT;
    });
};
