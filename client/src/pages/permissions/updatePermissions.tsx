import Api from 'actions/Api';
import Header from 'components/header/header';
import SideBar from 'components/side_bar/side_bar';
import { Role } from 'constants/interfaces';
import { History } from 'history';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEnumKeyByStringValue } from 'utils/enum';
import { Permissions } from 'components/permissions/Permissions';
import { Permission, RolesData } from 'constants/interfaces';
import { ENDPOINT_PERMISSION } from 'constants/endpoints';

export const UpdatePermissions = () => {
  const [permissionsData, setPermissionsData] = useState<RolesData>();

  useEffect(() => {
    const controller = new AbortController();
    const getTemplates = async () => {
      try {
        const fetchedPermissions = await Api.Get(
          `${ENDPOINT_PERMISSION}`,
          '',
          history,
          controller.signal,
        );
        const permissions = fetchedPermissions.permission.permissionObject;

        setPermissionsData(permissions);
      } catch (e) {
        console.log(e);
      }
    };
    getTemplates();
    return () => {
      controller.abort();
    };
  }, []);

  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState<string>('User');
  const history: History = useHistory<History>();

  const onRoleChange = (newRole: keyof typeof Role) => {
    setCurrentRole(newRole);
  };

  const handleCheckboxChange = (permission: Permission): void => {
    // Get the current role's selected permissions for diffrerent pages
    const selectedPermissions = permissionsData.roles[currentRole].pages;

    // Map over each page and update the permissions for the given key
    const updatedPermissions = selectedPermissions.map((page) => {
      // Map over each permission in the page and update the isChecked value for the given key
      const updatedPagePermissions = page.permissions.map((perm) => {
        // If the permission key matches the given key, update the isChecked value and return the updated permission
        if (perm.key === permission.key) {
          return {
            ...perm,
            isChecked: !perm.isChecked,
          };
        }
        // Otherwise, return the original permission
        return perm;
      });

      // Return the updated page with the updated permissions
      return {
        ...page,
        permissions: updatedPagePermissions,
      };
    });

    // Update the permissions data for the current role with the updated pages and permissions
    const updatedPermissionsData = {
      ...permissionsData,
      roles: {
        ...permissionsData.roles,
        [currentRole]: {
          ...permissionsData.roles[currentRole],
          pages: updatedPermissions,
        },
      },
    };

    // Update the state with the updated permissions data
    setPermissionsData(updatedPermissionsData);
  };

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region bg-light h-screen">
        <Header />

        <>
          <div className="col-md-4 mb-2">
            <h1 className="text-start">{t('permissions.permissionHeader')}</h1>
            <fieldset>
              <label htmlFor="role" className="form-label">
                {t('permissions.selectRole')}
              </label>
              <select
                className="form-select"
                id="role"
                required
                onChange={(e) => onRoleChange(getEnumKeyByStringValue(Role, e.target.value))}
              >
                <option value={Role.User}>{t('role.user')}</option>
                <option value={Role.Admin}>{t('role.admin')}</option>
                <option value={Role.MedicalDirector}>{t('role.medical_director')}</option>
                <option value={Role.HeadOfDepartment}>{t('role.head_department')}</option>
              </select>
            </fieldset>
          </div>

          <Permissions
            permissionsData={permissionsData}
            handleCheckboxChange={handleCheckboxChange}
            currentRole={currentRole}
          />
        </>
      </main>
    </div>
  );
};
