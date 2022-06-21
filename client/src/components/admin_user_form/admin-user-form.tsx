import {
  Department,
  emptyUser,
  GeneralDepartment,
  Role,
  UserJson,
} from 'constants/interfaces';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { getEnumKeyByStringValue } from 'utils/utils';
import { AdminUserFormData, ADMIN_USER_FORM_FIELDS } from 'constants/forms';

interface Props {
  data: {
    userData?: UserJson;
    departments: Map<string, Department>;
  };
  onSubmit: (data: AdminUserFormData) => Promise<void>;
}

export const AdminUserForm = (props: Props) => {
  const { register, handleSubmit, setValue, reset } = useForm<AdminUserFormData>({});
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const user: UserJson = props.data.userData ? props.data.userData : emptyUser;
  const departments: Map<string, Department> = props.data.departments;
  const hasDepartment = (role: keyof typeof Role): boolean =>
    Role[role] === Role.User || Role[role] === Role.HeadOfDepartment;
  const [showDepartment, setShowDepartment] = useState<boolean>(
    hasDepartment(getEnumKeyByStringValue(Role, user.role)),
  );

  const onRoleChange = (newRole: keyof typeof Role) => {
    const isShown = hasDepartment(newRole);
    setShowDepartment(isShown);
    if (!isShown) {
      setValue(ADMIN_USER_FORM_FIELDS.department.this, departments.get(GeneralDepartment));
    }
  };

  const submitForm = (data: AdminUserFormData) => {
    data.department.id = departments.get(data.department.name).id;
    props.onSubmit(data);
    reset({});
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          {t('adminAddUserUsername')}
        </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="username"
            autoComplete="new-username"
            {...register(ADMIN_USER_FORM_FIELDS.username)}
          ></input>
        </div>
        <div id="usernameHelp" className="form-text">
          {t('adminEditUserLeaveBlank')}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          {t('adminAddUserPassword')}
        </label>
        <div className="input-group">
          <input
            type={passwordShown ? 'text' : 'password'}
            className="form-control"
            id="password"
            autoComplete="new-password"
            {...register(ADMIN_USER_FORM_FIELDS.password)}
          ></input>
          <div className="input-group-text">
            <i
              onClick={() => setPasswordShown(true)}
              className={`${
                passwordShown ? 'd-none' : 'd-block'
              } btn btn-sm p-0 m-0 fa fa-eye-slash text-dark`}
            ></i>
            <i
              onClick={() => setPasswordShown(false)}
              className={`${
                passwordShown ? 'd-block' : 'd-none'
              } btn btn-sm p-0 m-0 fa fa-eye text-dark`}
            ></i>
          </div>
        </div>
        <div id="passwordHelp" className="form-text">
          {t('adminEditUserLeaveBlank')}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          {t('adminAddUserName')}
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          defaultValue={user.name}
          required
          {...register(ADMIN_USER_FORM_FIELDS.name)}
        ></input>
      </div>

      <div className="mb-3">
        <label htmlFor="role" className="form-label">
          {t('adminAddUserRole')}
        </label>
        <select
          className="form-select"
          id="role"
          defaultValue={user.role}
          required
          {...register(ADMIN_USER_FORM_FIELDS.role)}
          onChange={(e) => onRoleChange(getEnumKeyByStringValue(Role, e.target.value))}
        >
          <option value="" disabled hidden>
            {t('adminAddUserSelectRole')}
          </option>
          <option value={Role.User}>{i18n.t(Role.User)}</option>
          <option value={Role.Admin}>{i18n.t(Role.Admin)}</option>
          <option value={Role.MedicalDirector}>{i18n.t(Role.MedicalDirector)}</option>
          <option value={Role.HeadOfDepartment}>{i18n.t(Role.HeadOfDepartment)}</option>
        </select>
      </div>

      {showDepartment ? (
        <div className="mb-3">
          <label htmlFor="department" className="form-label">
            {t('adminAddUserDepartment')}
          </label>
          <select
            className="form-select"
            id="department"
            defaultValue={user.department.name}
            required
            {...register(ADMIN_USER_FORM_FIELDS.department.name)}
          >
            <option value="" disabled hidden>
              {t('adminAddUserSelectDepartment')}
            </option>
            {Array.from(departments.values()).map((dept: Department, index: number) => {
              return dept.name !== GeneralDepartment ? (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ) : null;
            })}
          </select>
        </div>
      ) : null}

      <div className="mt-5 mb-3 d-flex justify-content-center">
        <button type="submit" className="btn btn-dark col-6">
          {t('adminAddUserSubmit')}
        </button>
      </div>
    </form>
  );
};
