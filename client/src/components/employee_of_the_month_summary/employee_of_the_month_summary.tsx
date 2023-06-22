import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalImage from 'components/popup_modal/popup_modal_image';
import { currMonth, currYear } from 'utils/dateUtils';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import './employee_of_the_month_summary.css';
import { History } from 'history';
import Api from '../../actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { timezone, language } from 'constants/timezones';

interface EmployeeOfTheMonthSummaryProps extends RouteComponentProps {
  employeeOfTheMonth: EmployeeOfTheMonth;
  history: History;
}

export const EmployeeOfTheMonthSummary = (props: EmployeeOfTheMonthSummaryProps) => {
  const ALT_MESSAGE: string = 'Employee Of The Month...';
  const { t } = useTranslation();
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [employeeOfTheMonthImage, setEmployeeOfTheMonthImage] = useState<string>('');
  const updatedDate = props.employeeOfTheMonth.updatedAt;

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setImageModal(true);
  };

  const onModalImageClose = () => {
    setImageModal(false);
  };

  useEffect(() => {
    const getEmployeeOfTheMonthImage = async () => {
      setEmployeeOfTheMonthImage(
        await Api.Image(ENDPOINT_IMAGE_BY_PATH(props.employeeOfTheMonth.imgPath), props.history),
      );
    };

    // Only execute once employee of the month data has been successfully passed to this component
    if (props.employeeOfTheMonth !== null) getEmployeeOfTheMonthImage();
  }, [props.employeeOfTheMonth, props.history]);

  const translateMonth = (monthIndicator: number): string => {
    switch (monthIndicator) {
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
        show={imageModal}
        item={ALT_MESSAGE}
        image={employeeOfTheMonthImage}
        onModalClose={onModalImageClose}
        history={props.history}
        location={undefined}
        match={undefined}
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
              <p className="fs-6 lh-base text-break">
                {(Date.parse(updatedDate) &&
                  new Date(updatedDate).toLocaleDateString(language, {
                    timeZone: timezone,
                  })) || // If Date is already coverted, do not covert again on rerender (causes Invalid Date Error)
                  updatedDate}
              </p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthName')}</h6>
              <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.name}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDepartment')}</h6>
              <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.department.name}</p>
            </div>
            <div className="employee-image-container">
              <img
                src={employeeOfTheMonthImage}
                className={`employee-image img-thumbnail img-fluid mt-3 mb-3 ${
                  props.employeeOfTheMonth.imgPath ? 'd-block' : 'd-none'
                }`}
                alt={ALT_MESSAGE}
                onClick={(event: any) => {
                  onEnlargeImage(event);
                }}
              />
            </div>
            {/* </div> */}
          </div>
          <div className="employee-description">
            <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDescription')}</h6>
            <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
