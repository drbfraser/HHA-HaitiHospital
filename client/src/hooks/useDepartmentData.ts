import { History } from 'history';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from 'constants/queryKeys';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import { createDepartmentMap } from 'utils/departmentMapper';
import { useHistory } from 'react-router-dom';
import Api from 'actions/Api';

const useDepartmentData = () => {
  const history: History = useHistory<History>();

  const { data } = useQuery({
    queryKey: QUERY_KEY.department,
    queryFn: async () => await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history),
    staleTime: 60000, // 1 Hour
  });
  return { departmentMap: createDepartmentMap(data), departments: data };
};

export default useDepartmentData;
