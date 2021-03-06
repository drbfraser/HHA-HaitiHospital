import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalImage from 'components/popup_modal/popup_modal_image';
import { currMonth, currYear } from 'utils/dateFormatting';
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
  const { t: translateText } = useTranslation();
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [employeeOfTheMonthImage, setEmployeeOfTheMonthImage] = useState<string>('');

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
        return translateText('monthJanuary');
      case 1:
        return translateText('monthFebruary');
      case 2:
        return translateText('monthMarch');
      case 3:
        return translateText('monthApril');
      case 4:
        return translateText('monthMay');
      case 5:
        return translateText('monthJune');
      case 6:
        return translateText('monthJuly');
      case 7:
        return translateText('monthAugust');
      case 8:
        return translateText('monthSeptember');
      case 9:
        return translateText('monthOctober');
      case 10:
        return translateText('monthNovember');
      case 11:
        return translateText('monthDecember');
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
        <div style={{ display: 'flex', flex: '1 1 auto' }}>
          <div className="w-100 pr-2">
            <h2 className="mt-3 mb-3 fw-bold">
              {translateText('employeeOfTheMonthTitle').concat(
                translateMonth(currMonth).concat(' ').concat(currYear.toString()),
              )}
            </h2>
            <h6 className="fs-6 lh-base fw-bold">{translateText('employeeOfTheMonthDate')}</h6>
            <p className="fs-6 lh-base text-break">
              {new Date(props.employeeOfTheMonth.updatedAt).toLocaleDateString(language, {
                timeZone: timezone,
              })}
            </p>
            <h6 className="fs-6 fw-bold lh-base">{translateText('employeeOfTheMonthName')}</h6>
            <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.name}</p>
            <h6 className="fs-6 fw-bold lh-base">
              {translateText('employeeOfTheMonthDepartment')}
            </h6>
            <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.department.name}</p>
            <h6 className="fs-6 fw-bold lh-base">
              {translateText('employeeOfTheMonthDescription')}
            </h6>
            <p className="fs-6 lh-base text-break">{props.employeeOfTheMonth.description}</p>
          </div>
          <div className="w-100 pl-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};
