import axios from 'axios';
import { returnStatus } from "./statusActions";

import {
  LOGOUT_SUCCESS,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './types';

// export const loadMe = () => async (dispatch: any, getState: any) => {
//   dispatch({ type: ME_LOADING });

//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get('/api/users/me', options);

//     dispatch({
//       type: ME_SUCCESS,
//       payload: { me: response.data.me },
//     });
//   } catch (err: any) {
//     dispatch({
//       type: ME_FAIL,
//       payload: { error: err.response.data.message },
//     });
//   }
// };

// export const loginUser = (formData: any, history: any) => async (dispatch: any, getState: any) => {
//   dispatch({ type: LOGIN_WITH_EMAIL_LOADING });
//   try {
//     const response = await axios.post('/auth/login', formData);

//     dispatch({
//       type: LOGIN_WITH_EMAIL_SUCCESS,
//       payload: { token: response.data.token, me: response.data.me },
//     });

//     dispatch(loadMe());
//     history.push('/');
//   } catch (err: any) {
//     dispatch({
//       type: LOGIN_WITH_EMAIL_FAIL,
//       payload: { error: err.response.data.message },
//     });
//   }
// };

interface FormData {
  email: string;
  password: string
}

export const login = (formData: FormData) => (dispatch: any) => {
  // Headers
  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify(formData);

  axios
    .post("/api/users/login", body, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch({ type: LOGIN_LOADING });
    }
    )
    .catch((err) => {
      dispatch(returnStatus(err.response.data, err.response.status))
      dispatch({
        type: LOGIN_FAIL
      });
      dispatch({ type: LOGIN_LOADING })
    });
};

// export const logOutUser = (history) => async (dispatch) => {
//   try {
//     deleteAllCookies();
//     //just to log user logut on the server
//     await axios.get('/auth/logout');

//     dispatch({
//       type: LOGOUT_SUCCESS,
//     });
//     if (history) history.push('/');
//   } catch (err) {}
// };

// function deleteAllCookies() {
//   var cookies = document.cookie.split(';');

//   for (var i = 0; i < cookies.length; i++) {
//     var cookie = cookies[i];
//     var eqPos = cookie.indexOf('=');
//     var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//     document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
//   }
// }

export const attachTokenToHeaders = (getState: any) => {
  const token = getState().auth.token;

  const config: any = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
