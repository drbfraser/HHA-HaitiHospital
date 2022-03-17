import axios from 'axios';

interface FormData {
  username: string;
  password: string;
}

export const loginUser = async (dispatch, formData: FormData) => {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    const response = await axios.post('/api/auth/login', formData);
    const data = await response.data;
    if (data.success) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    }

    dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
    console.error(error);
  }
};

export const logOutUser = async (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  axios
    .get('/api/auth/logout')
    .then(() => {
      deleteAllCookies();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    })
    .catch((error) => {
      console.error('Error with logging out', error);
    });
};

const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
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
