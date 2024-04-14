import Api from 'actions/Api';
import {
  ENDPOINT_REPORTS,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
  ENDPOINT_REPORT_DELETE_BY_ID,
  ENDPOINT_REPORT_GET_BY_ID,
  ENDPOINT_TEMPLATE,
  ENDPOINT_TEMPLATE_BY_DEPARTMENT,
} from 'constants/endpoints';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

export const addReport = async (data: any, history: History) => {
  try {
    await Api.Post(
      ENDPOINT_REPORTS,
      data,
      () => history.push(`general-reports`),
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      ResponseMessage.getMsgCreateReportPending(),
      ResponseMessage.getMsgCreateReportOk(),
    );
  } catch (error) {
    console.error('Error adding report:', error);
  }
};
export const getAllReports = async (history: History): Promise<IReportObject<any>[]> => {
  const controller = new AbortController();
  try {
    const reports: IReportObject<any>[] = await Api.Get(
      ENDPOINT_REPORTS,
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return reports;
  } catch (error) {
    console.error('Error fetching all reports:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getReportsByDeptId = async (
  id: string,
  history: History,
): Promise<IReportObject<any>[]> => {
  const controller = new AbortController();
  try {
    const reports: IReportObject<any>[] = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_DEPARTMENT(id),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return reports;
  } catch (error) {
    console.error('Error fetching reports by department id:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getReportById = async (id: string, history: History): Promise<any> => {
  const controller = new AbortController();
  try {
    const reports = await Api.Get(
      ENDPOINT_REPORT_GET_BY_ID(id),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return reports;
  } catch (error) {
    console.error('Error fetching report by id:', error);
    throw error;
  } finally {
    controller.abort();
  }
};
export const getReportTemplate = async (departmentId: string, history: History): Promise<any> => {
  const controller = new AbortController();
  try {
    const reportTemplate = await Api.Get(
      ENDPOINT_TEMPLATE_BY_DEPARTMENT(departmentId),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    return reportTemplate;
  } catch (error) {
    console.error('Error fetching report template:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const updateReport = async (
  editedData: any,
  actionCallback: () => void,
  history: History,
) => {
  try {
    await Api.Put(
      ENDPOINT_REPORTS,
      editedData,
      actionCallback,
      history,
      ResponseMessage.getMsgUpdateReportFailed(),
      ResponseMessage.getMsgUpdateReportPending(),
      ResponseMessage.getMsgUpdateReportOk(),
    );
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};

export const updateReportTemplate = async (
  editedData: any,
  actionCallback: () => void,
  history: History,
) => {
  try {
    await Api.Put(
      ENDPOINT_TEMPLATE,
      editedData,
      actionCallback,
      history,
      ResponseMessage.getMsgUpdateReportTemplateFailed(),
      ResponseMessage.getMsgUpdateReportTemplatePending(),
      ResponseMessage.getMsgUpdateReportTemplateOk(),
    );
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};

export const deleteReport = async (id: string, actionCallback: () => void, history: History) => {
  try {
    await Api.Delete(
      ENDPOINT_REPORT_DELETE_BY_ID(id),
      {},
      actionCallback,
      history,
      ResponseMessage.getMsgDeleteReportFailed(),
      undefined,
      ResponseMessage.getMsgDeleteReportOk(),
    );
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};
