import httpService from './httpService';
import { History } from 'history';
import DbErrorHandler from './http_error_handler';

const ERROR_IMG: string = '';
const ERROR_OBJ: any = {};

/**
 *
 * @param url
 * - Endpoint URL
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns response.data
 * - Data retrieved from endpoint (Eg. JSON, Array)
 */
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

/**
 *
 * @param url
 * - Endpoint URL
 * @param obj
 * - Data to be sent to server (JSON)
 * @param actions
 * - Actions that should occur after PUT request is successful (Eg. Navigate to new page)
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns
 */
const Put = async (
  url: string,
  obj: any,
  actions: any,
  errorMsg: string,
  history: History,
): Promise<void> => {
  return await httpService
    .put(url, obj)
    .then(() => {
      actions();
      return;
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, errorMsg);
      return;
    });
};

// Custom
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

export default { Get, Put, Image };
