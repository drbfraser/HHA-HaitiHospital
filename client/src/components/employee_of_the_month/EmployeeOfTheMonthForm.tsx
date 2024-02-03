import { Department, GeneralDepartment } from 'constants/interfaces';
import { EmployeeOfTheMonth, isNonEmptyObject } from '../../pages/employee_of_the_month/typing';

import { imageCompressor } from 'utils/imageCompressor';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import ImageModal from 'components/popup_modal/ImageModal';
import path from 'path';

interface Props {
  onImageUpload: (item: File) => void;
  removeImageUpload: () => void;
  onSubmit: (data: any) => Promise<void>;

  // below is only for update form
  data?: EmployeeOfTheMonth;
  imageIsDeleted?: boolean;
  setImageIsDeleted?: Dispatch<SetStateAction<boolean>>;
}

export const EmployeeOfTheMonthForm = (props: Props) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<EmployeeOfTheMonth>({});
  const [employeeImageSrc, setEmployeeImageSrc] = useState<string | null>(null);

  function handleUploadImage(e) {
    console.log(e.target.files);
    imageCompressor(e.target.files[0], props.onImageUpload);
    setEmployeeImageSrc(URL.createObjectURL(e.target.files[0]));
  }

  function handleRemoveImage() {
    props.removeImageUpload();
    setEmployeeImageSrc(null);
    const inputElement = document.getElementById("employee-image") as HTMLInputElement
    inputElement.value = ""
  }

  const toAwardedAt = (awardedMonth: String, awardedYear: String) => {
    const awardedMonthUpdated = awardedMonth.length === 1 ? `0${awardedMonth}` : `${awardedMonth}`;
    const awardedAt = `${awardedYear}-${awardedMonthUpdated}`;
    return awardedAt;
  };

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <label className="font-weight-bold">{t('headerEmployeeOfTheMonth')}</label>
      <div className="container-fluid d-flex flex-column flex-lg-row gap-3">
        <div className="flex-grow-1">
          {props.data && (
            <input
              data-testid="eotm-id"
              className="form-control mb-2 mt-0"
              type="text"
              id="employee-eotmid"
              defaultValue={props?.data?.id}
              readOnly
              {...register('id', { required: true })}
            ></input>
          )}

          <label htmlFor="Employee Month Year" className="form-label">
            {t('employeeOfTheMonthMonthYearAwarded')}
          </label>
          <input
            data-testid="eotm-awarded-at"
            className="form-control mb-2 mt-0"
            type="month"
            id="employee-month"
            defaultValue={
              props.data &&
              toAwardedAt(props.data.awardedMonth.toString(), props.data.awardedYear.toString())
            }
            required
            {...register('awardedMonth', { required: true })}
          ></input>
          <label htmlFor="Employee Name" className="form-label">
            {t('employeeOfTheMonthName')}
          </label>
          <input
            data-testid="eotm-name"
            className="form-control mb-2 mt-0"
            type="text"
            id="employee-name"
            defaultValue={props?.data?.name}
            required
            {...register('name', { required: true })}
          ></input>
          <label htmlFor="Employee Department" className="form-label">
            {t('employeeOfTheMonthDepartment')}
          </label>
          <select
            data-testid="eotm-department"
            className="form-select mb-2 mt-0"
            id="employee-department"
            aria-label="Default select example"
            required
            {...register('department', { required: true })}
          >
            <option value="">{t('employeeOfTheMonthDepartmentOption')}</option>
            {Array.from(departments.values()).map((dept: Department, index: number) => {
              return dept.name !== GeneralDepartment ? (
                <option
                  key={index}
                  value={dept.name}
                  selected={props?.data?.department.name === dept.name}
                >
                  {t(`departments.${dept.name}`)}
                </option>
              ) : null;
            })}
          </select>
          <label htmlFor="Employee Description" className="form-label">
            {t('employeeOfTheMonthDescription')}
          </label>
          <textarea
            className="form-control mb-2 mt-0"
            id="employee-description"
            defaultValue={props?.data?.description}
            required
            {...register('description', { required: true })}
          ></textarea>
          {props.data && (
            <label className="text-wrap d-flex gap-2">
              <input
                type="checkbox"
                checked={props.imageIsDeleted}
                onClick={() => props.setImageIsDeleted(!props.imageIsDeleted)}
              />
              <span>Completely delete image</span>
            </label>
          )}
        </div>
        <div className="flex-grow-1">
          {(!props.data || (props.data && !props.imageIsDeleted)) && (
            <div>
              <label htmlFor="Employee Image" className="form-label mb-2">
                Update image
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="employee-image"
                onChange={handleUploadImage}
              />
            </div>
          )}
          <div className="d-flex flex-column align-items-start mt-3 gap-2">
          <img
            className="border"
            style={{ maxWidth: '250px', width: '100%', maxHeight: '500' }}
            src={employeeImageSrc || 'https://placehold.co/600x400?font=roboto'}
            alt={'Employee of the Month Image'}
          />
          {employeeImageSrc && (
            <button className="btn btn-danger" onClick={handleRemoveImage}>
              Remove Image
            </button>
          )}
          </div>
        </div>
      </div>
      <div>
        <button data-testid="eotm-submit-button" className="btn btn-primary mt-4" type="submit">
          {t('employeeOfTheMonthSubmitForm')}
        </button>
      </div>
    </form>
  );
};
