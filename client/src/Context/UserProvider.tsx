import UserContext, { User } from "./UserContext";
import React, { Component } from 'react';

class UserProvider extends Component {
  state = {
    id: '',
    user: '',
    name: '',
    role: '',
  };

  render() {
    return (
      <UserContext.Provider value={{
        id: '',
        username: '',
        name: '',
        role: '',
        updateUserData(user: User) {
          return null
        }
      }}>
      </UserContext.Provider>
    )
  }
}

export default UserProvider;