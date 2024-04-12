import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET_BY_DEPARTMENT } from 'constants/endpoints';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

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
