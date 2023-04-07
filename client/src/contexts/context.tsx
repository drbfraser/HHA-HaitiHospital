import { useReducer, useEffect, createContext, useContext, Dispatch } from 'react';
import { initialState, AuthReducer } from './reducer';
import { UserJson } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';

const AuthStateContext = createContext<any>({} as any);

const AuthDispatchContext = createContext<Dispatch<any>>({} as Dispatch<any>);

export function useAuthState() {
  const context = useContext<UserJson>(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') ?? window.navigator.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
