import { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from '../../actions/Api';
import { ENDPOINT_BIOMECH_GET_BY_ID, ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { TOAST_BIOMECH_GET } from 'constants/toast_messages';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { History } from 'history';

interface BrokenKitViewProps extends RouteComponentProps {}

export const BrokenKitView = (props: BrokenKitViewProps) => {
  const { t } = useTranslation();
  const [BioReport, setBioReport] = useState({} as any);
  const [BioReportImage, setBioReportImage] = useState<string>('');
  const id: string = useLocation().pathname.split('/')[3];
  const history: History = useHistory<History>();

  const getBioReport = async () => {
    setBioReport(await Api.Get(ENDPOINT_BIOMECH_GET_BY_ID(id), TOAST_BIOMECH_GET, history));
  };

  const getBioReportImage = async () => {
    setBioReportImage(await Api.Image.get(ENDPOINT_IMAGE_BY_PATH(BioReport.imgPath), history));
  };

  useEffect(() => {
    getBioReport();

    // Only execute once biomech data has been successfully passed to this component
    if (BioReport.imgPath !== undefined) {
      getBioReportImage();
    }
  }, [BioReport]);

  return (
    <div className={'case-study-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 d-flex justify-content-start">
          <Link to="/biomechanic">
            <button type="button" className="btn btn-outline-dark">
              {t('brokenKitReportBack')}
            </button>
          </Link>
        </div>
        <div className="mb-5">
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100">
              <h4 className="mt-3 mb-3 fw-bold">{t('brokenKitReportBrokenKitReport')}</h4>
              <h6 className="fs-6 lh-base">
                {t('brokenKitReportAuthor')} {BioReport.user ? BioReport.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-3 lh-base">
                Date:{' '}
                {new Date(BioReport.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Cancun',
                })}
              </h6>
              <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportNameOfEquipment')}</h6>
              <p className="fs-6 lh-base text-break">{BioReport.equipmentName}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportPriorityOfEquipment')}</h6>
              <p className="fs-6 lh-base text-break">{BioReport.equipmentPriority}</p>
              <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportFaultWithEquipment')}</h6>
              <p className="fs-6 lh-base text-break">{BioReport.equipmentFault}</p>
            </div>
            <div className="w-100">
              <img
                src={BioReportImage}
                alt="Bio Report Here..."
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  BioReport.imgPath ? 'd-block' : 'd-none'
                }`}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
