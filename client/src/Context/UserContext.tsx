import React from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface IUserContext {
  id: string;
  username: string;
  name: string;
  role: string;
  updateUserData(user: User): void;
}

const UserContext = React.createContext<IUserContext>({
  id: "",
  username: '',
  name: '',
  role: "",
  updateUserData(user: User) {
    return null;
  },
});

export default UserContext;