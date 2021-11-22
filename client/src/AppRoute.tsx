import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAuthState } from 'Context';

const AppRoutes = ({ component: Component, path, isPrivate, rolesRequired, ...rest }) => {
	const userDetails = useAuthState();
  const currentUserRole = userDetails.userDetails.role;
  let roleAccess = true;
  if (isRoleRequired(rolesRequired)) {
    roleAccess = false;
    if (isRoleAuthenticated(rolesRequired, currentUserRole)) {
      roleAccess = true;
    }
  }

	return (
		<Route
			path={path}
			render={(props) =>
				isPrivate && !Boolean(userDetails.isAuth && roleAccess) ? (
          <Redirect to={{ pathname: '/login' }} />
				) : (
          <Component {...props} />
				)
			}
			{...rest}
		/>
	);
};

const isRoleRequired = (rolesRequired) => {
  if (rolesRequired.length > 0) {
    return true;
  }
  return false;
}

const isRoleAuthenticated = (rolesRequired, currentUserRole) => {
  if (rolesRequired.length > 0) {
    const userRoleAuthenticated = rolesRequired.find(role => currentUserRole === role);
    if (userRoleAuthenticated) {
      return true;
    }
  }
  return false;
}

export default AppRoutes;