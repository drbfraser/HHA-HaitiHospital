import httpService from './httpService';
import { toast } from 'react-toastify';

const ERROR_CODE: string = 'ERROR';

const Get = async (url: string, errorMsg: string): Promise<any> => {
  return await httpService
    .get(url)
    .then((response: any) => {
      return response.data;
    })
    .catch((err: any) => {
      toast.error(errorMsg);
      return ERROR_CODE;
    });
};

const Image = async (url: string): Promise<string> => {
  return await httpService
    .get(url, {
      responseType: 'blob',
    })
    .then((response: any) => {
      return URL.createObjectURL(response.data);
    })
    .catch(() => {
      toast.error('Unable to fetch image');
      return ERROR_CODE;
    });
};

export default { Get, Image };
