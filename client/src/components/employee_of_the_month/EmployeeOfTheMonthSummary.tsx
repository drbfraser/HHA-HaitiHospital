import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month/typing';
import { History } from 'history';
import ImageModal from 'components/popup_modal/ImageModal';
import { Role } from 'constants/interfaces';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
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
  const authState = useAuthState();

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

  return (
    <div className="carousel-item">
      <div className="d-block w-100 ">
        <div className="p-4 m-3  w-100" style={{ height: '500px' }}>
          <ImageModal
            show={showImageModal}
            item={ALT_MESSAGE}
            image={employeeImage}
            onModalClose={onModalImageClose}
          ></ImageModal>
          <div className="d-flex flex-column justify-content-between flex-xl-row">
            <div className="d-flex flex-column mt-3">
              <h6 className="fs-6 lh-base fw-bold">{t('employeeOfTheMonthDate')}</h6>
              <p className="fs-6 lh-base">{updatedDate}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthName')}</h6>
              <p className="fs-6 lh-base">{props.employee.name}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('employeeOfTheMonthDepartment')}</h6>
              <p className="fs-6 lh-base">{t(`departments.${props.employee.department.name}`)}</p>
            </div>
            {employeeImage && (
              <img
                className="d-flex text-left float-left ms-xl-auto mt-3 mb-3"
                style={{ maxWidth: '250px', width: '100%', maxHeight: '500', cursor: 'pointer' }}
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
        </div>
      </div>
    </div>
  );
};
