import axios from 'axios';
import { History } from 'history';
import * as Error from './ApiError';
import DbErrorHandler from './http_error_handler';
import { Translator } from 'utils/internationalization/internationalization';

const { ResponseMessage } = Translator;
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
  try {
    const response: any = await axios.get(url);
    return response.data;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return Error.ERROR_OBJ;
  }
};

/**
 *
 * @param url
 * - Endpoint URL
 * @param obj
 * - Data to be sent to server (JSON)
 * @param actions
 * - Actions that should occur after POST request is successful
 * - (Eg. Navigate to new page)
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @returns void
 */
const Post = async (
  url: string,
  obj: object = {},
  actions: any,
  errorMsg: string,
  history: History,
): Promise<void> => {
  try {
    await axios.post(url, obj);
    actions();
    return;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return;
  }
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
  try {
    await axios.put(url, obj);
    actions();
    return;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return;
  }
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
  try {
    await axios.patch(url, obj);
    actions();
    return;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return;
  }
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
  try {
    await axios.delete(url, { data: obj });
    actions();
    return;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return;
  }
};

/**
 *
 * @param url
 * - Endpoint URL
 * @param history
 * - History instance from navigation
 * @returns void
 */
const Image = async (url: string, history: History): Promise<string> => {
  try {
    const response: any = await axios.get(url, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  } catch (error: any) {
    DbErrorHandler(error, history, ResponseMessage.getMsgFetchImageFailed());
    return Error.ERROR_IMG;
  }
};

const Api = { Get, Post, Put, Patch, Delete, Image };

export default Api;
