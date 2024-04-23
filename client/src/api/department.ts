import { DepartmentJson } from '@hha/common';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENTS_GET, ENDPOINT_DEPARTMENT_GET_BY_ID } from 'constants/endpoints';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

export const getAllDepartments = async (history: History): Promise<DepartmentJson[]> => {
  const controller = new AbortController();
  try {
    const departments: DepartmentJson[] = await Api.Get(
      ENDPOINT_DEPARTMENTS_GET,
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return departments;
  } catch (error) {
    console.error('Error fetching all departments:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getDepartmentById = async (id: string, history: History): Promise<DepartmentJson> => {
  const controller = new AbortController();
  try {
    const department: DepartmentJson = await Api.Get(
      ENDPOINT_DEPARTMENT_GET_BY_ID(id),
      ResponseMessage.getMsgFetchDepartmentFailed(),
      history,
      controller.signal,
    );
    return department;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  } finally {
    controller.abort();
  }
};
