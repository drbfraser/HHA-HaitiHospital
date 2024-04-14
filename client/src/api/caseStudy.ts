import Api from 'actions/Api';
import {
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_FEATURED,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_GET_BY_ID,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
  ENDPOINT_CASESTUDY_POST,
} from 'constants/endpoints';
import { TOAST_CASESTUDY_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import { CaseStudy } from 'pages/case_study/typing';
import { ResponseMessage } from 'utils/response_message';

export const addCaseStudy = async (
  data: CaseStudy,
  actionCallback: () => void,
  history: History,
  selectedFile?: File,
) => {
  try {
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    await Api.Post(
      ENDPOINT_CASESTUDY_POST,
      formData,
      actionCallback,
      history,
      ResponseMessage.getMsgCreateCaseStudyFailed(),
      undefined,
      ResponseMessage.getMsgCreateCaseStudyOk(),
    );
  } catch (error) {
    console.error('Error adding biomech:', error);
  }
};

export const getAllCaseStudies = async (history: History): Promise<CaseStudy[]> => {
  const controller = new AbortController();
  try {
    const caseStudies: CaseStudy[] = await Api.Get(
      ENDPOINT_CASESTUDY_GET,
      ResponseMessage.getMsgFeatureCaseStudyOk(),
      history,
      controller.signal,
    );
    return caseStudies;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getCaseStudyById = async (id: string, history: History): Promise<CaseStudy> => {
  const controller = new AbortController();
  try {
    const caseStudy: CaseStudy = await Api.Get(
      ENDPOINT_CASESTUDY_GET_BY_ID(id),
      TOAST_CASESTUDY_GET_ERROR,
      history,
      controller.signal,
    );
    return caseStudy;
  } catch (error) {
    console.error('Error fetching case study:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getFeaturedCaseStudy = async (history: History): Promise<CaseStudy> => {
  const controller = new AbortController();
  try {
    const caseStudy: CaseStudy = await Api.Get(
      ENDPOINT_CASESTUDY_FEATURED,
      TOAST_CASESTUDY_GET_ERROR,
      history,
      controller.signal,
    );
    return caseStudy;
  } catch (error) {
    console.error('Error fetching featured case study:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const featureCaseStudy = async (
  id: string,
  actionCallback: () => void,
  history: History,
) => {
  await Api.Patch(
    ENDPOINT_CASESTUDY_PATCH_BY_ID(id),
    {},
    actionCallback,
    history,
    ResponseMessage.getMsgFeatureCaseStudyFailed(),
    'Get case study pending',
    ResponseMessage.getMsgFeatureCaseStudyOk(),
  );
};

export const deleteCaseStudy = async (
  id: string,
  deleteCaseStudyCallback: () => void,
  history: History,
) => {
  try {
    await Api.Delete(
      ENDPOINT_CASESTUDY_DELETE_BY_ID(id),
      {},
      deleteCaseStudyCallback,
      history,
      ResponseMessage.getMsgDeleteCaseStudyOk(),
      undefined,
      ResponseMessage.getMsgDeleteCaseStudyFailed(),
    );
  } catch (error) {
    console.error('Error deleting case study:', error);
  }
};
