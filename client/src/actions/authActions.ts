import axios, { AxiosError } from 'axios';
import { ENDPOINT_LOGIN, ENDPOINT_LOGOUT } from 'constants/endpoints';
import Api from './Api';
import { History } from 'history';

interface FormData {
  username: string;
  password: string;
}

export const loginUser = async (dispatch, formData: FormData) => {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    const response = await axios.post(ENDPOINT_LOGIN, formData);
    const data = response.data;
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    localStorage.setItem('currentUser', JSON.stringify(data));
    return data;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
    if (axios.isAxiosError(error)) {
      const err: AxiosError = error as AxiosError;
      if (err.response.status < 500) {
        return { success: false, error: err.message };
      } else {
        throw new Error(`Internal Error: ${err.message}`);
      }
    } else {
      throw new Error(`${error}`);
    }
  }
};

const onLogout = () => {
  deleteAllCookies();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const logOutUser = async (dispatch, history: History) => {
  dispatch({ type: 'LOGOUT' });
  await Api.Post(
    ENDPOINT_LOGOUT,
    {},
    onLogout,
    history,
    'Logging out failed',
    'Logging out...',
    'Logged out successfully!',
  );
};

const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

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

export const getCSRFToken = async (): Promise<void> => {
  try {
    const response = await axios.get('api/auth/csrftoken');
    axios.defaults.headers.post['X-CSRF-Token'] = response.data.CSRFToken;
  } catch (error) {
    console.error('Error with getting the CSRF token', error);
  }
};
