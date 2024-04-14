import { BiomechJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_BIOMECH_GET,
  ENDPOINT_BIOMECH_DELETE_BY_ID,
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_IMAGE_BY_PATH,
  ENDPOINT_BIOMECH_UPDATE_BY_ID,
  ENDPOINT_BIOMECH_POST,
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

export const getAllBiomechs = async (history: History): Promise<BiomechJson[]> => {
  const controller = new AbortController();
  try {
    const biomechs: BiomechJson[] = await Api.Get(
      ENDPOINT_BIOMECH_GET,
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return biomechs;
  } catch (error) {
    console.error('Error fetching biomechs:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getBiomechById = async (id: string, history: History): Promise<BiomechJson> => {
  const controller = new AbortController();
  try {
    const biomech: BiomechJson = await Api.Get(
      ENDPOINT_BIOMECH_GET_BY_ID(id),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return biomech;
  } catch (error) {
    console.error('Error fetching biomechs:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getBiomechFormById = async (id: string, history: History): Promise<BiomechForm> => {
  const controller = new AbortController();
  try {
    // TODO make a distinct FORM endpoint that also fetches the image file
    const biomechForm: BiomechForm = await Api.Get(
      ENDPOINT_BIOMECH_GET_BY_ID(id),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return biomechForm;
  } catch (error) {
    console.error('Error fetching biomechs:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const updateBiomech = async (
  id: string,
  data: BiomechForm,
  onSubmitAction: () => void,
  history: History,
) => {
  try {
    // Parse to FormData() to support multipart/data-form form
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await Api.Put(
      ENDPOINT_BIOMECH_UPDATE_BY_ID(id),
      formData,
      onSubmitAction,
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      undefined,
      ResponseMessage.getMsgCreateReportOk(),
    );
  } catch (error) {
    console.error('Error updating biomech', error);
    throw error;
  }
};

export const deleteBiomech = async (
  id: string,
  deleteBiomechCallback: () => void,
  history: History,
) => {
  try {
    await Api.Delete(
      ENDPOINT_BIOMECH_DELETE_BY_ID(id),
      {},
      deleteBiomechCallback,
      history,
      ResponseMessage.getMsgDeleteReportFailed(),
      undefined,
      ResponseMessage.getMsgCreateReportOk(),
    );
  } catch (error) {
    console.error('Error deleting biomech:', error);
  }
};
