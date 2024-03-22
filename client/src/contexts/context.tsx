import { useReducer, createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { initialState, AuthReducer } from './reducer';
import { UserJson } from 'constants/interfaces';

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

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const AdminToggle = createContext<
  { adminToggleState: boolean; setAdminToggleState: Dispatch<SetStateAction<boolean>> } | undefined
>(undefined);

export const AdminToggleProvider = ({ children }: { children: any }) => {
  const [adminToggleState, setAdminToggleState] = useState(false);

  return (
    <AdminToggle.Provider value={{ adminToggleState, setAdminToggleState }}>
      {children}
    </AdminToggle.Provider>
  );
};

export const useAdminToggleState = () => {
  const context = useContext(AdminToggle);
  if (context === undefined) {
    throw new Error('useAdminToggleState must be used within a AdminToggleProvider');
  }
  return context;
};
