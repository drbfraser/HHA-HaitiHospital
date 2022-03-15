import axios from 'axios';
import { History } from 'history';
import * as Image from './Image';
import * as Error from './ApiError';
import DbErrorHandler from './http_error_handler';

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
  return await axios
    .get(url)
    .then((response: any) => {
      return response.data;
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, errorMsg);
      return Error.ERROR_OBJ;
    });
};

/**
 *
 * @param url
 * - Endpoint URL
 * @param obj
 * - Data to be sent to server (JSON)
 * @param actions
 * - Actions that should occur after PUT request is successful
 * - (Eg. Navigate to new page)
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns void
 */
const Put = async (
  url: string,
  obj: object = {},
  actions: any,
  errorMsg: string,
  history: History,
): Promise<void> => {
  return await axios
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

/**
 *
 * @param url
 * - Endpoint URL
 * @param obj
 * - Data to be sent to server (JSON)
 * @param actions
 * - Actions that should occur after PATCH request is successful
 * - (Eg. Navigate to new page)
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns void
 */
const Patch = async (
  url: string,
  obj: object = {},
  actions: any,
  errorMsg: string,
  history: History,
): Promise<void> => {
  return await axios
    .patch(url, obj)
    .then(() => {
      actions();
      return;
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, errorMsg);
      return;
    });
};

/**
 *
 * @param url
 * - Endpoint URL
 * @param obj
 * - Data to be deleted (Optional)
 * @param actions
 * - Actions that should occur after DELETE request is successful
 * - (Eg. Navigate to new page)
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns void
 */
const Delete = async (
  url: string,
  obj: object = {},
  actions: any,
  errorMsg: string,
  history: History,
): Promise<void> => {
  return await axios
    .delete(url, { data: obj })
    .then(() => {
      actions();
      return;
    })
    .catch((err: any) => {
      DbErrorHandler(err, history, errorMsg);
      return;
    });
};

const Api = { Image, Get, Put, Patch, Delete };

export default Api;
