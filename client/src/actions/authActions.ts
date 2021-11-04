import axios from 'axios';

import {
  LOGOUT_SUCCESS,
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

interface FormData {
  username: string;
  password: string
}

export async function loginUser (formData: FormData, props) {
  axios.post('/auth/login', formData).then(res => {
      props.history.push("./home");
  }).catch(error => {
      console.error("Error with logging in", error)
  });
}

// TODO: Potential fix this function for logging out once merged with latest in master
export const logOutUser = (history) => async (dispatch) => {
  try {
    deleteAllCookies();
    //just to log user logut on the server
    await axios.get('/auth/logout');

    dispatch({
      type: LOGOUT_SUCCESS,
    });
    if (history) history.push('/');
  } catch (err) {}
};

function deleteAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

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
