import { Dispatch, SetStateAction } from 'react';
import { Permission, Page, RolesData } from 'constants/interfaces';

export const Permissions = ({
  permissionsData,
  setPermissionsData,
  handleCheckboxChange,
  currentRole,
}: {
  permissionsData: RolesData;
  setPermissionsData: Dispatch<SetStateAction<RolesData>>;
  handleCheckboxChange: (permission: Permission) => void;
  currentRole: string;
}): JSX.Element => {
  return (
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
              {permissionsData.roles[currentRole].pages.map((page: Page) => (
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
  );
};
