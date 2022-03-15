import axios from 'axios';
import { History } from 'history';
import * as Error from './ApiError';
import DbErrorHandler from './http_error_handler';

export const get = async (url: string, history: History): Promise<string> => {
  return await axios
    .get(url, {
      responseType: 'blob',
    })
    .then((response: any) => {
      return URL.createObjectURL(response.data);
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, 'Unable to fetch image');
      return Error.ERROR_IMG;
    });
};
