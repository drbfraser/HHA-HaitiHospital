import { useState } from 'react';
import { History } from 'history';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from 'constants/queryKeys';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import { Department } from 'constants/interfaces';
import { createDepartmentMap } from 'utils/departmentMapper';
import { useHistory } from 'react-router-dom';
import Api from 'actions/Api';

const useDepartmentMap = () => {
  const [departments, setDepartments] = useState<Map<string, Department>>(undefined);
  const history: History = useHistory<History>();

  useQuery({
    queryKey: QUERY_KEY.department,
    queryFn: async () => await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history),
    staleTime: 60000, // 1 Hour
    onSuccess(data) {
      setDepartments(createDepartmentMap(data));
    },
  });

  return departments;
};

export default useDepartmentMap;
