let user = localStorage.getItem('currentUser')
  ? JSON.parse(localStorage.getItem('currentUser')).user
  : '';
let isAuth = localStorage.getItem('currentUser')
  ? JSON.parse(localStorage.getItem('currentUser')).isAuth
  : '';

export const initialState = {
  userDetails: '' || user,
  isAuth: '' || isAuth,
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        userDetails: action.payload.user,
        isAuth: action.payload.isAuth,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        userDetails: '',
        isAuth: '',
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        // TODO: Potentially change the message sent back from the backend to be more user friendly than dev friendly
        errorMessage: action.error.toJSON().message + ' Invalid login',
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
