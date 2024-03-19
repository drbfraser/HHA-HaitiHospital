import { History } from 'history';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from 'constants/queryKeys';
import { ENDPOINT_DEPARTMENTS_GET } from 'constants/endpoints';
import { ResponseMessage } from 'utils/response_message';
import { createDepartmentNameMap, createDepartmentIdMap } from 'utils/departmentMapper';
import { useHistory } from 'react-router-dom';
import Api from 'actions/Api';

export interface Department {
  id: string;
  name: string;
}

const useDepartmentData = () => {
  const history: History = useHistory<History>();

  const { data } = useQuery({
    queryKey: QUERY_KEY.department,
    queryFn: async () =>
      await Api.Get(
        ENDPOINT_DEPARTMENTS_GET,
        ResponseMessage.getMsgFetchDepartmentsFailed(),
        history,
      ),
    staleTime: 60000, // 1 Hour
  });

  return {
    departments: data as Department[],
    departmentNameKeyMap: createDepartmentNameMap(data),
    departmentIdKeyMap: createDepartmentIdMap(data),
  };
};

export default useDepartmentData;
