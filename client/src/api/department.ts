import { BiomechJson, DepartmentJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_BIOMECH_GET,
  ENDPOINT_BIOMECH_DELETE_BY_ID,
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_IMAGE_BY_PATH,
  ENDPOINT_BIOMECH_UPDATE_BY_ID,
  ENDPOINT_BIOMECH_POST,
  ENDPOINT_DEPARTMENT_GET_BY_ID,
} from 'constants/endpoints';
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
