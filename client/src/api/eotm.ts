import { EmployeeOfTheMonthJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET_BY_ID,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
} from 'constants/endpoints';
import {
  TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
  TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
} from 'constants/toastErrorMessages';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

export const addEotm = async (data: FormData, onSubmit: () => void, history: History) => {
  try {
    await Api.Post(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST,
      data,
      onSubmit,
      history,
      ResponseMessage.getMsgCreateReportOk(),
      undefined,
      ResponseMessage.getMsgCreateReportFailed(),
    );
  } catch (error) {
    console.error('Error adding employee of the month:', error);
  }
};

export const getEotmById = async (
  id: string,
  history: History,
): Promise<EmployeeOfTheMonthJson[]> => {
  const controller = new AbortController();
  try {
    const eotm: EmployeeOfTheMonthJson | EmployeeOfTheMonthJson[] = await Api.Get(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET_BY_ID(id), // can also be year/month
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return [eotm].flat();
  } catch (error) {
    console.error('Error fetching employee of the month: ', error);
    throw error;
  } finally {
    controller.abort();
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

export const updateEotm = async (data: FormData, onSubmitAction: () => void, history: History) => {
  try {
    await Api.Put(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
      data,
      onSubmitAction,
      history,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
    );
  } catch (error) {
    console.error('Error updating employee of the month', error);
    throw error;
  }
};
