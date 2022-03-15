import httpService from './httpService';
import { History } from 'history';
import DbErrorHandler from './http_error_handler';

const ERROR_IMG: string = '';
const ERROR_OBJ: any = {};

const Get = async (url: string, errorMsg: string, history: History): Promise<any> => {
  return await httpService
    .get(url)
    .then((response: any) => {
      return response.data;
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, errorMsg);
      return ERROR_OBJ;
    });
};

const Image = async (url: string, history: History): Promise<string> => {
  return await httpService
    .get(url, {
      responseType: 'blob',
    })
    .then((response: any) => {
      return URL.createObjectURL(response.data);
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, 'Unable to fetch image');
      return ERROR_IMG;
    });
};

export default { Get, Image };
