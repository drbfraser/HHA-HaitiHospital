import './employee_of_the_month_summary.css';

import { currMonth, currYear } from 'utils/dateUtils';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import { History } from 'history';
import ModalImage from 'components/popup_modal/popup_modal_image';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps {
  employee: EmployeeOfTheMonth;
  history: History;
}

export const EmployeeOfTheMonthSummary = (props: Props) => {
  const ALT_MESSAGE: string = 'Employee Of The Month...';
  const { t } = useTranslation();
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [employeeImage, setEmployeeImage] = useState<string>(null);
  const updatedDate = props.employee.updatedAt;

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setShowImageModal(true);
  };

  const onModalImageClose = () => {
    setShowImageModal(false);
  };

  useEffect(() => {
    const getEmployeeOfTheMonthImage = async () => {
      const employeeImage = await Api.Image(
        ENDPOINT_IMAGE_BY_PATH(props.employee.imgPath),
        props.history,
      );
      setEmployeeImage(employeeImage);
    };

    getEmployeeOfTheMonthImage();
  }, [props.employee, props.history]);

  const translateMonth = (index: number): string => {
    switch (index) {
      case 0:
        return t('monthJanuary');
      case 1:
        return t('monthFebruary');
      case 2:
        return t('monthMarch');
      case 3:
        return t('monthApril');
      case 4:
        return t('monthMay');
      case 5:
        return t('monthJune');
      case 6:
        return t('monthJuly');
      case 7:
        return t('monthAugust');
      case 8:
        return t('monthSeptember');
      case 9:
        return t('monthOctober');
      case 10:
        return t('monthNovember');
      case 11:
        return t('monthDecember');
    }
  };

  return (
    <div className="employee-container mb-5">
      <ModalImage
        show={showImageModal}
        item={ALT_MESSAGE}
        image={employeeImage}
        onModalClose={onModalImageClose}
        history={props.history}
      ></ModalImage>
      <div className="employee-subcontainer">
        <div className="employee-image-description flex flex-col">
          <div className="top-description">
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {t('employeeOfTheMonthTitle').concat(
                  translateMonth(currMonth).concat(' ').concat(currYear.toString()),
                )}
              </h2>
              <h6 className="fs-6 lh-base fw-bold">{t('employeeOfTheMonthDate')}</h6>
              <p className="fs-6 lh-base text-break">{updatedDate}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthName')}</h6>
              <p className="fs-6 lh-base text-break">{props.employee.name}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDepartment')}</h6>
              <p className="fs-6 lh-base text-break">{props.employee.department.name}</p>
            </div>
            <div className="employee-image-container">
              {employeeImage && (
                <img
                  src={employeeImage}
                  className={`employee-image img-thumbnail img-fluid mt-3 mb-3`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              )}
            </div>
          </div>
          <div className="employee-description">
            <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDescription')}</h6>
            <p className="fs-6 lh-base text-break">{props.employee.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
