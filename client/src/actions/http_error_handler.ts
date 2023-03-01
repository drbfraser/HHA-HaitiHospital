import { AxiosError } from 'axios';
import { History } from 'history';
import { toast } from 'react-toastify';
import { ErrorListToast } from '../components/error/error_list';

const BADREQUEST_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOTFOUND_CODE = 404;
const CONFLICT_CODE = 409;
const INTERNAL_CODE = 500;
const UNPROCCESABLENTITY_CODE = 422;

const DbErrorHandler = (e, history: History, toastMsg: string) => {
  const err = e as AxiosError;
  if (err.isAxiosError === undefined) {
    console.log(e.message);
    return;
  }

  switch (err.response.status) {
    case UNAUTHORIZED_CODE: {
      history.push('/unauthorized');
      break;
    }
    case NOTFOUND_CODE: {
      toast.error('API URL not found');
      break;
    }
    case INTERNAL_CODE: {
      toast.error(`Internal Error: ${toastMsg}`);
      break;
    }
    case CONFLICT_CODE:
    case BADREQUEST_CODE: {
      toast.error(`${toastMsg}: Invalid input`);
      break;
    }
    case UNPROCCESABLENTITY_CODE: {
      toast.error(ErrorListToast(toastMsg, err.response.data.errors), {
        autoClose: false,
        closeOnClick: false,
        progress: 1,
      });
      break;
    }
    default:
      console.error('Error Needs a Handler');
  }
};

export default DbErrorHandler;
