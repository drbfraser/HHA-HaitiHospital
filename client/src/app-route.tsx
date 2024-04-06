import { Redirect, Route } from 'react-router-dom';
import { DepartmentJson as Department, Role } from '@hha/common';
import {
  isRoleRequired,
  isRoleAuthenticated,
  isDepartmentRequired,
  isDepartmentAllowed,
} from 'actions/roleActions';

import { useAuthState } from 'contexts';

const AppRoutes = ({
  component: Component,
  path,
  loginRequired,
  rolesAllowed,
  departmentsAllowed,
  ...rest
}: {
  component: (_: any) => JSX.Element;
  path: string;
  loginRequired: boolean;
  rolesAllowed: Role[];
  departmentsAllowed: any[];
}) => {
  const currentUserInfo = useAuthState();
  const currentUserRole = currentUserInfo.userDetails.role;
  const currentUserDepartment = currentUserInfo.userDetails.department;

  let roleAccess = true;
  if (isRoleRequired(rolesAllowed)) {
    roleAccess = false;
    if (isRoleAuthenticated(rolesAllowed, currentUserRole)) {
      roleAccess = true;
    }
  }

  let departmentAccess = true;
  // Theoretically the Admin and Medical director should be able to access all departmental pages.
  if (![Role.Admin, Role.MedicalDirector].includes(currentUserRole)) {
    if (isDepartmentRequired(departmentsAllowed as Department[])) {
      departmentAccess = false;
      if (isDepartmentAllowed(departmentsAllowed as Role[], currentUserDepartment.name)) {
        departmentAccess = true;
      }
    }
  }

  // This function renders content based on role and department
  const renderContent = (props: any) => {
    // The reason we have role access or departmentAccess is because we will always allow someone with RoleAccess to enter
    // Thus, will short circuit even if they don't have departmentAccess (e.g. DepartmentHeads)
    // however user's with role User won't be able to enter unless they have departmentAccess
    // If login is required to access the page and the user is not authenticated nor do they have role access
    if (loginRequired && !Boolean(currentUserInfo.isAuth && roleAccess)) {
      // If the user is logged in, and trying to access a department page
      if (
        isDepartmentRequired(departmentsAllowed) &&
        isDepartmentAllowed(departmentsAllowed, currentUserDepartment.name)
      ) {
        return <Component {...props} />;
      }

      // If the user is logged in, and does not have role or department access redirect them to not found page
      if (!Boolean(roleAccess && departmentAccess)) {
        return <Redirect to={{ pathname: '/unauthorized' }} />;
      } else {
        // Otherwise, if user is not logged in and they try to access other pages, redirect to login page
        return <Redirect to={{ pathname: '/login' }} />;
      }
    } else {
      return <Component {...props} />;
    }
  };

  return <Route path={path} exact render={(props) => renderContent(props)} {...rest} />;
};

export default AppRoutes;
