import { AxiosAdapter, AxiosError } from "axios";
import React, {useHistory} from 'react-router-dom';

const UNAUTHORIZE_CODE = 401;
const NOTFOUND_CODE = 404;
const INTERNAL_CODE = 500;

const FailedReqHandler = (e: AxiosError) => {
    const history = useHistory();
    switch (parseInt(e.code)) {
        case (UNAUTHORIZE_CODE): {
            history.push('/unauthorized');
            break;
        }
        case (NOTFOUND_CODE) : {
            alert("API URL not found");
            break;
        }
        case (INTERNAL_CODE) : {
            alert(`Internal Error ${e.response}`);
            break;
        }
        default:
            alert("Axios Error Needs a Handler");
    }
}

export default FailedReqHandler;