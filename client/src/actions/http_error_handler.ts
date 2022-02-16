import { AxiosError } from 'axios';
import { History } from 'history';
import { toast } from 'react-toastify';

const BADREQUEST_CODE = 400;
const UNAUTHORIZE_CODE = 401;
const NOTFOUND_CODE = 404;
const INTERNAL_CODE = 500;

const DbErrorHandler = (e, history: History) => {
  if ((e as AxiosError).isAxiosError === undefined) {
    console.log(e.message);
    return;
  }

  switch (e.response.status) {
    case UNAUTHORIZE_CODE: {
      history.push('/unauthorized');
      break;
    }
    case NOTFOUND_CODE: {
      toast.error('API URL not found');
      break;
    }
    case INTERNAL_CODE: {
      toast.error(`Internal Error ${e.response}`);
      break;
    }
    case BADREQUEST_CODE: {
      toast.error(`Invalid Report`);
      break;
    }
    default:
      console.log('Axios Error Needs a Handler');
  }
};

export default DbErrorHandler;
