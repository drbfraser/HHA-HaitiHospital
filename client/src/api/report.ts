import Api from 'actions/Api';
import {
  ENDPOINT_REPORTS,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
  ENDPOINT_REPORT_DELETE_BY_ID,
} from 'constants/endpoints';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

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
