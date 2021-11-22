let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).user
  : '';
let isAuth = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).isAuth
  : '';

export const initialState = {
  userDetails: '' || user,
  isAuth: '' || isAuth,
  loading: false,
  errorMessage: null
};


export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        loading: true
      };
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        isAuth: action.payload.isAuth,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
        isAuth: ''
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};