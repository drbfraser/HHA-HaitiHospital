import axios from 'axios';
import { History } from 'history';
import * as Error from './ApiError';
import { TOAST_IMAGE_BY_PATH } from 'constants/toast_messages';
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
      DbErrorHandler(err, history, TOAST_IMAGE_BY_PATH);
      return Error.ERROR_IMG;
    });
};
