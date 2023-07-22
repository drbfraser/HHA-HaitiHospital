import { currMonth, currYear } from 'utils/dateUtils';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month/typing';
import { History } from 'history';
import ImageModal from 'components/popup_modal/ImageModal';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  employee: EmployeeOfTheMonth;
}

export const EmployeeOfTheMonthSummary = (props: Props) => {
  const ALT_MESSAGE: string = 'Employee Of The Month...';
  const { t } = useTranslation();
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [employeeImage, setEmployeeImage] = useState<string>(null);
  const updatedDate = props.employee.updatedAt;
  const history: History = useHistory<History>();

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
        history,
      );
      setEmployeeImage(employeeImage);
    };

    props.employee.imgPath && getEmployeeOfTheMonthImage();
  }, [props.employee.imgPath, history]);

  const translateMonth = (index: number): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[index - 1];
  };
  return (
    <>
      <ImageModal
        show={showImageModal}
        item={ALT_MESSAGE}
        image={employeeImage}
        onModalClose={onModalImageClose}
        history={history}
      ></ImageModal>
      <div className="d-flex flex-column flex-xl-row">
        <div className="d-flex flex-column">
          <h2 className="mt-3 mb-3 fw-bold">
            {t('employeeOfTheMonthTitle').concat(
              translateMonth(props.employee.awardedMonth)
                .concat(' ')
                .concat(props.employee.awardedYear.toString()),
            )}
          </h2>
          <h6 className="fs-6 lh-base fw-bold">{t('employeeOfTheMonthDate')}</h6>
          <p className="fs-6 lh-base">{updatedDate}</p>
          <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthName')}</h6>
          <p className="fs-6 lh-base">{props.employee.name}</p>
          <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDepartment')}</h6>
          <p className="fs-6 lh-base">{props.employee.department.name}</p>
        </div>
        {employeeImage && (
          <img
            className="d-flex mx-auto ms-xl-auto mt-3 mb-3"
            style={{ maxWidth: '400px', width: '100%', maxHeight: '500', cursor: 'pointer' }}
            src={employeeImage}
            alt={ALT_MESSAGE}
            onClick={(event: any) => {
              onEnlargeImage(event);
            }}
          />
        )}
      </div>
      <>
        <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDescription')}</h6>
        <p className="fs-6 lh-base">{props.employee.description}</p>
      </>
    </>
  );
};
