import { Page, Permission, RolesData } from 'constants/interfaces';

interface PermissionsProps {
  permissionsData: RolesData;
  handleCheckboxChange: (permission: Permission) => void;
  currentRole: string;
}

export const Permissions = ({
  permissionsData,
  handleCheckboxChange,
  currentRole,
}: PermissionsProps): JSX.Element => (
  <table className="table">
    <thead>
      <tr>
        <th>Page Name</th>
        <th>Permissions</th>
      </tr>
    </thead>
    <tbody>
      {permissionsData?.roles[currentRole]?.pages?.map((page: Page) => (
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
);
