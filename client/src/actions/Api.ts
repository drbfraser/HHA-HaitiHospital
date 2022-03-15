import axios from 'axios'
import { toast } from 'react-toastify';
import * as Image from './Image'
import * as Error from './ApiError'

export const Get = async (url: string, errorMsg: string): Promise<any> => {
    return await axios
      .get(url)
      .then((response: any) => {
        return response.data;
      })
      .catch((err: any) => {
        toast.error(errorMsg);
        return Error.DEFAULT;
      });
  };

const Api = {Image, Get}

export default Api