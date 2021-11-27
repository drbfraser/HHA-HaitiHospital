import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isRoleRequired, isRoleAuthenticated } from 'actions/roleActions';

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

export default AppRoutes;