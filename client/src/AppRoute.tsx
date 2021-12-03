import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isRoleRequired, isRoleAuthenticated } from 'actions/roleActions';

import { useAuthState } from 'Context';

const AppRoutes = ({ component: Component, path, loginRequired, rolesAllowed, departmentsAllowed, ...rest }) => {
	const userDetails = useAuthState();
  const currentUserRole = userDetails.userDetails.role;
  let roleAccess = true;
  if (isRoleRequired(rolesAllowed)) {
    roleAccess = false;
    if (isRoleAuthenticated(rolesAllowed, currentUserRole)) {
      roleAccess = true;
    }
  }

	return (
		<Route
			path={path} exact
			render={(props) =>
				loginRequired && !Boolean(userDetails.isAuth && roleAccess) ? (
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