import * as ApiError from './ApiError';

import axios, { AxiosError, AxiosResponse } from 'axios';

import DbErrorHandler from './http_error_handler';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';
import i18n from 'i18n';
import { toast } from 'react-toastify';

/**
 *
 * @param url
 * - Endpoint URL
 * @param errorMsg
 * - Error message for toast
 * @param history
 * - History instance from navigation
 * @param signal
 * - AbortSignal signal to cancel request (Optional) so that it is backwards compatible
 * @returns response.data
 * - Data retrieved from endpoint (Eg. JSON, Array)
 */
const Get = async (
  url: string,
  errorMsg: string,
  history: History,
  signal: AbortSignal = new AbortController().signal,
): Promise<any> => {
  try {
    const response: AxiosResponse<any, any> = await axios.get(url, { signal: signal });
    return response.data;
  } catch (error: any) {
    DbErrorHandler(error, history, errorMsg);
    return ApiError.ERROR_OBJ;
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
 * @param history
 * - History instance from navigation
 * @param errorMsg
 * - Error message for toast
 * @param pendingMsg
 * - Pending message for toast
 * @param successMsg
 * - Success message for toast
 * @returns void
 */

const Post = async (
  url: string,
  obj: object = {},
  actions: (data: any) => void,
  history: History,
  errorMsg?: string,
  pendingMsg?: string,
  successMsg?: string,
) => {
  await toast.promise(
    axios.post(url, obj).then(
      (res) => actions && actions(res.data),
      (err: AxiosError | Error) => DbErrorHandler(err, history, errorMsg),
    ),
    {
      error: errorMsg ? errorMsg : i18n.t('request_response.default.failed'),
      pending: pendingMsg ? pendingMsg : i18n.t('request_response.default.pending'),
      success: successMsg ? successMsg : i18n.t('request_response.default.ok'),
    },
    {
      autoClose: 3000,
    },
  );
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
 * @param history
 * - History instance from navigation
 * @param errorMsg
 * - Error message for toast
 * @param pendingMsg
 * - Pending message for toast
 * @param successMsg
 * - Success message for toast
 * @returns void
 */
const Put = async (
  url: string,
  obj: object = {},
  actions: () => void,
  history: History,
  errorMsg?: string,
  pendingMsg?: string,
  successMsg?: string,
): Promise<void> => {
  await toast.promise(
    axios.put(url, obj).then(
      () => actions(),
      (err: AxiosError | Error) => DbErrorHandler(err, history, errorMsg),
    ),
    {
      error: errorMsg ? errorMsg : i18n.t('request_response.default.failed'),
      pending: pendingMsg ? pendingMsg : i18n.t('request_response.default.pending'),
      success: successMsg ? successMsg : i18n.t('request_response.default.ok'),
    },
  );
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
 * @param history
 * - History instance from navigation
 * @param errorMsg
 * - Error message for toast
 * @param pendingMsg
 * - Pending message for toast
 * @param successMsg
 * - Success message for toast
 * @returns void
 */
const Patch = async (
  url: string,
  obj: object = {},
  actions: () => void,
  history: History,
  errorMsg: string,
  pendingMsg: string,
  successMsg: string,
): Promise<void> => {
  await toast.promise(
    axios
      .patch(url, obj)
      .then(actions, (err: AxiosError | Error) => DbErrorHandler(err, history, errorMsg)),
    {
      error: errorMsg ? errorMsg : i18n.t('request_response.default.failed'),
      pending: pendingMsg ? pendingMsg : i18n.t('request_response.default.pending'),
      success: successMsg ? successMsg : i18n.t('request_response.default.ok'),
    },
  );
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
 * @param history
 * - History instance from navigation
 * @param errorMsg
 * - Error message for toast
 * @param pendingMsg
 * - Pending message for toast
 * @param successMsg
 * - Success message for toast
 * @returns void
 */
const Delete = async (
  url: string,
  obj: object = {},
  actions: () => void,
  history: History,
  errorMsg?: string,
  pendingMsg?: string,
  successMsg?: string,
): Promise<void> => {
  await toast.promise(
    axios
      .delete(url, obj)
      .then(actions, (err: AxiosError | Error) => DbErrorHandler(err, history, errorMsg)),
    {
      error: errorMsg ? errorMsg : i18n.t('request_response.default.failed'),
      pending: pendingMsg ? pendingMsg : i18n.t('request_response.default.pending'),
      success: successMsg ? successMsg : i18n.t('request_response.default.ok'),
    },
  );
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
    return ApiError.ERROR_IMG;
  }
};

const Api = { Get, Post, Put, Patch, Delete, Image };

export default Api;
