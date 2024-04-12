import { BiomechJson, EmployeeOfTheMonthJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_BIOMECH_GET,
  ENDPOINT_BIOMECH_DELETE_BY_ID,
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_IMAGE_BY_PATH,
  ENDPOINT_BIOMECH_UPDATE_BY_ID,
  ENDPOINT_BIOMECH_POST,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID,
} from 'constants/endpoints';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import { BiomechForm } from 'pages/biomech/typing';
import { ResponseMessage } from 'utils/response_message';

export const addBiomech = async (data: BiomechForm, onSubmit: () => void, history: History) => {
  try {
    // Parse to FormData() to support multipart/data-form form
    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key as keyof BiomechForm]));

    await Api.Post(
      ENDPOINT_BIOMECH_POST,
      formData,
      onSubmit,
      history,
      ResponseMessage.getMsgCreateReportOk(),
      undefined,
      ResponseMessage.getMsgCreateReportFailed(),
    );
  } catch (error) {
    console.error('Error adding biomech:', error);
  }
};

export const getAllEotms = async (history: History): Promise<EmployeeOfTheMonthJson[]> => {
  const controller = new AbortController();
  try {
    const eotms: EmployeeOfTheMonthJson[] = await Api.Get(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
      TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
      history,
      controller.signal,
    );
    return eotms;
  } catch (error) {
    console.error('Error fetching all employee of the months:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const deleteEotm = async (id: string, actionCallback: () => void, history: History) => {
  try {
    await Api.Delete(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID(id),
      {},
      actionCallback,
      history,
      ResponseMessage.getMsgDeleteEotmFailed(),
      undefined,
      ResponseMessage.getMsgDeleteEotmFailed(),
    );
  } catch (error) {
    console.error('Error deleting employee of the month:', error);
  }
};
