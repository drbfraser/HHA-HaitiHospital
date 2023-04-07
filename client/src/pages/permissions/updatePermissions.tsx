import Api from 'actions/Api';
import Header from 'components/header/header';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import SideBar from 'components/side_bar/side_bar';
import { Department, Role } from 'constants/interfaces';
import { ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { History } from 'history';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { ReportAndTemplateForm } from 'components/report_upload_form/reportAndUpload_form';
import { ResponseMessage } from '../../utils/response_message';
import { UploadForm } from 'components/template/template_form';
import { useDepartmentData } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UpdatePermissions = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState();
  const history: History = useHistory<History>();
  const { departments } = useDepartmentData();

  interface Permission {
    name: string;
    key: string;
    isChecked: boolean;
  }

  interface Page {
    name: string;
    key: string;
    permissions: Permission[];
  }

  type Permissions = Permission[];

  const permissionsData = {
    roles: {
      admin: {
        name: 'Admin',
        key: 'admin',
        pages: [
          {
            name: 'Dashboard',
            key: 'dashboard',
            permissions: [
              {
                name: 'View Dashboard',
                key: 'view_dashboard',
              },
              {
                name: 'Edit Dashboard',
                key: 'edit_dashboard',
              },
              {
                name: 'Delete Dashboard',
                key: 'delete_dashboard',
              },
            ],
          },
          {
            name: 'Settings',
            key: 'settings',
            permissions: [
              {
                name: 'View Settings',
                key: 'view_settings',
              },
              {
                name: 'Edit Settings',
                key: 'edit_settings',
              },
              {
                name: 'Delete Settings',
                key: 'delete_settings',
              },
            ],
          },
        ],
      },
      user: {
        name: 'User',
        key: 'user',
        pages: [
          {
            name: 'Dashboard',
            key: 'dashboard',
            permissions: [
              {
                name: 'View Dashboard',
                key: 'view_dashboard',
              },
            ],
          },
          {
            name: 'Settings',
            key: 'settings',
            permissions: [
              {
                name: 'View Settings',
                key: 'view_settings',
              },
            ],
          },
        ],
      },
      guest: {
        name: 'Guest',
        key: 'guest',
        pages: [
          {
            name: 'Settings',
            key: 'settings',
            permissions: [
              {
                name: 'View Settings',
                key: 'view_settings',
              },
            ],
          },
        ],
      },
    },
  };

  const [selectedPermissions, setSelectedPermissions] = useState(
    permissionsData.roles.admin.pages[0].permissions,
  );

  function handleCheckboxChange(permission: Permission) {
    const updatedPermissions = selectedPermissions.map((p) => {
      if (p.key === permission.key) {
        return {
          ...permission,
          isChecked: !permission.isChecked,
        };
      }
      return p;
    });
    setSelectedPermissions(updatedPermissions);
    permissionsData.roles.admin.pages.forEach((page) => {
      page.permissions = updatedPermissions.filter((p) => p.key.startsWith(page.key));
    }); // Update the JSON object
  }

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region bg-light h-screen">
        <Header />

        <>
          <div className="col-md-6 mb-2">
            <h1 className="text-start">{t('permissions.permissionHeader')}</h1>
            <fieldset>
              <label htmlFor="role" className="form-label">
                {t('permissions.selectRole')}
              </label>
              <select
                className="form-select"
                id="role"
                // defaultValue={userData.role}
                required
                // {...register(ADMIN_USER_FORM_FIELDS.role)}
                // onChange={(e) => onRoleChange(getEnumKeyByStringValue(Role, e.target.value))}
              >
                <option value="" disabled hidden>
                  {t('admin.user_form.inquiry_role')}
                </option>
                <option value={Role.User}>{t('role.user')}</option>
                <option value={Role.Admin}>{t('role.admin')}</option>
                <option value={Role.MedicalDirector}>{t('role.medical_director')}</option>
                <option value={Role.HeadOfDepartment}>{t('role.head_department')}</option>
              </select>
            </fieldset>
          </div>

          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Page Name</th>
                      <th>Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsData.roles.admin.pages.map((page: Page) => (
                      <tr key={page.key}>
                        <td>{page.name}</td>
                        <td>
                          {page.permissions.map((permission: Permission) => (
                            <div className="form-check" key={permission.key}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={permission.key}
                                id={permission.key}
                                checked={permission.isChecked}
                                onChange={() => handleCheckboxChange(permission)}
                              />
                              <label className="form-check-label" htmlFor={permission.key}>
                                {permission.name}
                              </label>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      </main>
    </div>
  );
};
