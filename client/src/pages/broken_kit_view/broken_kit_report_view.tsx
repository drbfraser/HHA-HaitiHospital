import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface BrokenKitViewProps extends RouteComponentProps {}

export const BrokenKitView = (props: BrokenKitViewProps) => {
  const { t } = useTranslation();
  const [BioReport, setBioReport] = useState({} as any);
  const [BioReportImage, setBioReportImage] = useState<string>('');
  const id = useLocation().pathname.split('/')[3];
  const BioReportUrl = `/api/biomech/${id}`;

  const getBioReport = useCallback(async () => {
    const res = await axios.get(BioReportUrl);
    setBioReport(res.data);
  }, [BioReportUrl]);

  const getBioReportImage = async () => {
    await axios
      .get(`/api/image/${BioReport.imgPath.split('/')[2]}`, {
        responseType: 'blob',
      })
      .then((response: any) => {
        setBioReportImage(URL.createObjectURL(response.data));
      })
      .catch(() => {
        toast.error('Unable to fetch image');
      });
  };

  useEffect(() => {
    getBioReport();
    // Only execute once biomech data has been successfully passed to this component
    if (BioReport.imgPath !== undefined) getBioReportImage();
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
        <div className="mb-5 col-lg-6 col-md-8 col-sm-10 col-12">
          <div>
            <h4 className="mt-3 mb-3 fw-bold">{t('brokenKitReportBrokenKitReport')}</h4>
            <h6 className="fs-6 lh-base">
              {t('brokenKitReportAuthor')} {BioReport.user ? BioReport.user.name : '[deleted]'}
            </h6>
            <h6 className="fs-6 mb-3 lh-base">
              Date:{' '}
              {new Date(BioReport.createdAt).toLocaleDateString('en-US', {
                timeZone: 'America/Los_Angeles',
              })}
            </h6>
            <img
              src={BioReportImage}
              alt="Bio Report Here..."
              className={`img-thumbnail img-fluid mt-3 mb-3 ${
                BioReport.imgPath ? 'd-block' : 'd-none'
              }`}
            />
            <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportNameOfEquipment')}</h6>
            <p className="fs-6 lh-base text-break">{BioReport.equipmentName}</p>
            <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportPriorityOfEquipment')}</h6>
            <p className="fs-6 lh-base text-break">{BioReport.equipmentPriority}</p>
            <h6 className="fs-6 fw-bold lh-base">{t('brokenKitReportFaultWithEquipment')}</h6>
            <p className="fs-6 lh-base text-break">{BioReport.equipmentFault}</p>
          </div>
        </div>
      </main>
    </div>
  );
};
