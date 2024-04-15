import { ADMIN_USER_FORM_FIELDS, AdminUserFormData } from 'pages/admin/typing';
import { Department, GeneralDepartment, Role, UserDetails } from 'constants/interfaces';

import { EMPTY_USER_JSON } from 'constants/default_values';
import { getEnumKeyByStringValue } from 'utils';
import { initAdminForm } from './utils';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// no whitespace
const USERNAME_PATTERN = /^\S*$/;

// at least one uppercase letter, one lowercase letter, one number and one special character
const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{6,}$/;

interface Props {
  data: {
    userData?: UserDetails;
    departments: Map<string, Department>;
  };
  onSubmit: (data: AdminUserFormData) => Promise<void>;
  newUser?: boolean;
}

export const AdminUserForm = (props: Props) => {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const userData: UserDetails = props.data.userData ? props.data.userData : EMPTY_USER_JSON;
  const { register, handleSubmit, setValue } = useForm<AdminUserFormData>({
    defaultValues: initAdminForm(userData),
  });
  const departments: Map<string, Department> = props.data.departments;

  const hasDepartment = (role: keyof typeof Role): boolean =>
    Role[role] === Role.User || Role[role] === Role.HeadOfDepartment;

  const hasDepartmentEnumKeyByStringValue = (userRole: Role): boolean => {
    const deptKeyOrNull = getEnumKeyByStringValue(Role, userRole);
    return deptKeyOrNull ? hasDepartment(deptKeyOrNull) : false;
  };

  const [showDepartment, setShowDepartment] = useState<boolean>(
    hasDepartmentEnumKeyByStringValue(userData.role),
  );

  const onRoleChange = (newRole: string) => {
    const newRoleEnum = getEnumKeyByStringValue(Role, newRole);
    const isShown = newRoleEnum ? hasDepartment(newRoleEnum) : false;
    setShowDepartment(isShown);

    if (!isShown) {
      setValue(
        ADMIN_USER_FORM_FIELDS.department.this,
        departments.get(GeneralDepartment) as Department,
      );
    }
  };

  const submitForm = async (data: AdminUserFormData) => {
    const deptName = departments.get(data.department.name);
    if (typeof deptName !== 'undefined') {
      data.department.id = deptName.id;
    }
    await props.onSubmit(data);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          {t(`admin.user_form.username`)}
        </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="username"
            autoComplete="new-username"
            required={props.newUser}
            minLength={2}
            maxLength={20}
            {...register(ADMIN_USER_FORM_FIELDS.username, {
              pattern: USERNAME_PATTERN,
            })}
            onChange={handleUsernameChange}
          ></input>
        </div>
        <div id="usernameHelp" className="form-text">
          {props.newUser && t('admin.user_form.hint.username_hint')}
          {!props.newUser &&
            (username.length > 0
              ? t('admin.user_form.hint.username_hint')
              : t('admin.user_form.hint.leave_blank'))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          {t('admin.user_form.password')}
        </label>
        <div data-testid="password-outer-div" className="input-group">
          <input
            type={passwordShown ? 'text' : 'password'}
            className="form-control"
            id="password"
            autoComplete="new-password"
            required={props.newUser}
            minLength={6}
            maxLength={60}
            {...register(ADMIN_USER_FORM_FIELDS.password, {
              pattern: PASSWORD_PATTERN,
            })}
            onChange={handlePasswordChange}
          ></input>
          <div data-testid="toggle-password-shown" className="input-group-text">
            <i
              onClick={() => setPasswordShown(true)}
              className={`${
                passwordShown ? 'd-none' : 'd-block'
              } btn btn-sm p-0 m-0 fa fa-eye-slash text-dark`}
              style={{ fontFamily: 'FontAwesome' }}
            ></i>
            <i
              onClick={() => setPasswordShown(false)}
              className={`${
                passwordShown ? 'd-block' : 'd-none'
              } btn btn-sm p-0 m-0 fa fa-eye text-dark`}
              style={{ fontFamily: 'FontAwesome' }}
            ></i>
          </div>
        </div>
        <div id="passwordHelp" className="form-text">
          {props.newUser && t('admin.user_form.hint.password_hint')}
          {!props.newUser &&
            (password.length > 0
              ? t('admin.user_form.hint.password_hint')
              : t('admin.user_form.hint.leave_blank'))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          {t('admin.user_form.name')}
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          defaultValue={userData.name}
          required
          {...register(ADMIN_USER_FORM_FIELDS.name)}
        ></input>
      </div>

      <div className="mb-3">
        <label htmlFor="role" className="form-label">
          {t('admin.user_form.role')}
        </label>
        <select
          className="form-select"
          id="role"
          defaultValue={userData.role}
          required
          {...register(ADMIN_USER_FORM_FIELDS.role)}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="" disabled hidden>
            {t('admin.user_form.inquiry_role')}
          </option>
          <option value={Role.User}>{t('role.user')}</option>
          <option value={Role.Admin}>{t('role.admin')}</option>
          <option value={Role.MedicalDirector}>{t('role.medical_director')}</option>
          <option value={Role.HeadOfDepartment}>{t('role.head_department')}</option>
          <option value={Role.BioMechanic}>{t('role.bio_mechanic')}</option>
        </select>
      </div>

      {showDepartment ? (
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            {t('admin.user_form.department')}
          </label>
          <select
            className="form-select"
            id="department"
            defaultValue={userData.department.name}
            required
            {...register(ADMIN_USER_FORM_FIELDS.department.name)}
          >
            <option value="" disabled hidden>
              {t('admin.user_form.inquiry_department')}
            </option>
            {Array.from(departments.values()).map((dept: Department, index: number) => {
              return dept.name !== GeneralDepartment ? (
                <option key={index} value={dept.name}>
                  {t(`departments.${dept.name}`)}
                </option>
              ) : null;
            })}
          </select>
        </div>
      ) : null}

      <div className="mt-5 mb-3 d-flex justify-content-center">
        <button data-testid="add-user-submit-button" type="submit" className="btn btn-dark col-6">
          {t('button.submit')}
        </button>
      </div>
    </form>
  );
};
