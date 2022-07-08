import { AxiosError } from 'axios';
import { History } from 'history';
import { toast } from 'react-toastify';
import { ErrorListToast } from '../components/Errors/ErrorToast';

const BADREQUEST_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOTFOUND_CODE = 404;
const INTERNAL_CODE = 500;
const UNPROCCESABLENTITY_CODE = 422;

const DbErrorHandler = (e, history: History, toastMsg: string, errorActions?: any) => {
  const err = e as AxiosError;
  if (err.isAxiosError === undefined) {
    console.log(e.message);
    return;
  }

  switch (e.response.status) {
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
    case BADREQUEST_CODE: {
      toast.error(toastMsg);
      break;
    }
    case UNPROCCESABLENTITY_CODE: {
      toast.error(ErrorListToast(toastMsg, err.response.data.errors), {
        closeOnClick: true,
        autoClose: false,
      });
      break;
    }
    default:
      console.log('Axios Error Needs a Handler');
  }
};

export default DbErrorHandler;
