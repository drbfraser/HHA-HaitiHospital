import React, { useReducer } from 'react';
import { initialState, AuthReducer } from './reducer';
import { UserJson } from 'constants/interfaces';

const AuthStateContext = React.createContext<any>({} as any);

const AuthDispatchContext = React.createContext<React.Dispatch<any>>({} as React.Dispatch<any>);

export function useAuthState() {
  const context = React.useContext<UserJson>(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);
  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
