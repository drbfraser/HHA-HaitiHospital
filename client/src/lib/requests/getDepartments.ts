import Api from '../../actions/Api';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import { History } from 'history';

export const getDepartments = async (history: History) => {
  await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history);
};
