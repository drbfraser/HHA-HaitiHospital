import { Department, GeneralDepartment, Role, UserDetails } from 'constants/interfaces';
import { EMPTY_USER_JSON } from 'constants/default_values';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getEnumKeyByStringValue } from 'utils/utils';
import { AdminUserFormData, ADMIN_USER_FORM_FIELDS } from 'pages/admin/typing';
import { initAdminForm } from '../utils';

interface Props {
  data: {
    userData?: UserDetails;
    departments: Map<string, Department>;
  };
  onSubmit: (data: AdminUserFormData) => Promise<void>;
}

export const AdminUserForm = (props: Props) => {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const userData: UserDetails = props.data.userData ? props.data.userData : EMPTY_USER_JSON;
  const { register, handleSubmit, setValue } = useForm<AdminUserFormData>({
    defaultValues: initAdminForm(userData),
  });
  const departments: Map<string, Department> = props.data.departments;
  const hasDepartment = (role: keyof typeof Role): boolean =>
    Role[role] === Role.User || Role[role] === Role.HeadOfDepartment;
  const [showDepartment, setShowDepartment] = useState<boolean>(
    hasDepartment(getEnumKeyByStringValue(Role, userData.role)),
  );

  const onRoleChange = (newRole: keyof typeof Role) => {
    const isShown = hasDepartment(newRole);
    setShowDepartment(isShown);
    if (!isShown) {
      setValue(ADMIN_USER_FORM_FIELDS.department.this, departments.get(GeneralDepartment));
    }
  };

  const submitForm = async (data: AdminUserFormData) => {
    data.department.id = departments.get(data.department.name).id;
    await props.onSubmit(data);
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
            {...register(ADMIN_USER_FORM_FIELDS.username)}
          ></input>
        </div>
        <div id="usernameHelp" className="form-text">
          {t('admin.user_form.hint.leave_blank')}
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
            {...register(ADMIN_USER_FORM_FIELDS.password)}
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
          {t('admin.user_form.hint.leave_blank')}
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
          onChange={(e) => onRoleChange(getEnumKeyByStringValue(Role, e.target.value))}
        >
          <option value="" disabled hidden>
            {t('admin.user_form.inquiry_role')}
          </option>
          <option value={Role.User}>{t('role.user')}</option>
          <option value={Role.Admin}>{t('role.admin')}</option>
          <option value={Role.MedicalDirector}>{t('role.medical_director')}</option>
          <option value={Role.HeadOfDepartment}>{t('role.head_department')}</option>
          <option value={Role.BioMechanical}>{t('role.bio_mechanic')}</option>
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
                  {dept.name}
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
