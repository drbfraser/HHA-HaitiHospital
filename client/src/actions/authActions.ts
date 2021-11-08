import axios from 'axios';

interface FormData {
  username: string;
  password: string
}

export async function loginUser (formData: FormData) {
  return await axios.post('/auth/login', formData);
}

export async function logOutUser () {
  axios.get('/auth/logout').then(() => {
    deleteAllCookies();
  }).catch(error => {
      console.error("Error with logging out", error)
  });
}

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
