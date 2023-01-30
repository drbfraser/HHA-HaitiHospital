import Api from 'actions/Api';
import { ENDPOINT_ADMIN_ME } from 'constants/endpoints';
import { History } from 'history';
import { QUERY_KEY } from 'constants/queryKeys';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const useCurrentUserData = () => {
  const history: History = useHistory<History>();
  const {data} = useQuery({
    queryKey: QUERY_KEY.currentUser,
    queryFn: async () => await Api.Get(ENDPOINT_ADMIN_ME, "Unable to submit the report", history),
    staleTime: 60000, // 1 Hour
  });

  return {
    currentUser: data
  };
};

export default useCurrentUserData;
