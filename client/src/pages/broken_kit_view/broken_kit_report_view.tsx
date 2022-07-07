import { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, Link, useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from '../../actions/Api';
import { ENDPOINT_BIOMECH_GET_BY_ID, ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import ModalImage from 'components/popup_modal/popup_modal_image';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import './broken_kit_report_view.css';
import { History } from 'history';
import { setPriority } from 'pages/broken_kit_report/BiomechModel';
import { timezone, language } from 'constants/timezones';
import { BioReportIdParams, Paths } from 'constants/paths';
import { Translator } from 'utils/internationalization/internationalization';

const { Content, ResponseMessage } = Translator;

interface BrokenKitViewProps extends RouteComponentProps {}

export const BrokenKitView = (props: BrokenKitViewProps) => {
  const ALT_MESSAGE: string = 'Broken kit report...';
  const { t } = useTranslation();
  const [BioReport, setBioReport] = useState({} as any);
  const [BioReportImage, setBioReportImage] = useState<string>('');
  const [imageModal, setImageModal] = useState<boolean>(false);
  const params = useParams<BioReportIdParams>();
  const id: string = useMemo(() => params.bioId, [params.bioId]);
  const history: History = useHistory<History>();

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setImageModal(true);
  };

  const onModalImageClose = () => {
    setImageModal(false);
  };

  useEffect(
    function fetchReportInitially() {
      const getBioReport = async () => {
        setBioReport(
          await Api.Get(
            ENDPOINT_BIOMECH_GET_BY_ID(id),
            ResponseMessage.getMsgFetchReportFailed(),
            history,
          ),
        );
      };
      getBioReport();
    },
    [history, id],
  );

  useEffect(
    function fetchImage() {
      const getBioReportImage = async () => {
        setBioReportImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(BioReport.imgPath), history));
      };

      // Only execute once biomech data has been successfully passed to this component
      if (BioReport.imgPath !== undefined) {
        getBioReportImage();
      }
    },
    [BioReport, history],
  );

  return (
    <div className="broken-kit-main">
      <ModalImage
        show={imageModal}
        item={ALT_MESSAGE}
        image={BioReportImage}
        onModalClose={onModalImageClose}
        history={props.history}
        location={undefined}
        match={undefined}
      ></ModalImage>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="d-flex justify-content-start">
          <Link to={Paths.getBioMechMain()}>
            <button type="button" className="btn btn-outline-dark">
              {t('button.back')}
            </button>
          </Link>
        </div>
        <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
          <div className="broken-kit-container mb-5">
            <div className="broken-kit-subcontainer">
              <div style={{ display: 'flex', flex: '1 1 auto' }}>
                <div className="w-100 pr-2">
                  kkk
                  <h2 className="mt-3 mb-3 fw-bold">{t('biomech.view_report.title')}</h2>
                  <h6 className="fs-6 lh-base">
                    {`${t('biomech.view_report.author')}: `}
                    {BioReport.user ? BioReport.user.name : 'status.not_available'}
                  </h6>
                  <h6 className="fs-6 mb-3 lh-base">
                    Date:{' '}
                    {new Date(BioReport.createdAt).toLocaleDateString(language, {
                      timeZone: timezone,
                    })}
                  </h6>
                  <h6 className="fs-6 fw-bold lh-base">
                    {t('biomech.view_report.equipment_name')}
                  </h6>
                  <p className="fs-6 lh-base text-break">{BioReport.equipmentName}</p>
                  <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.priority')}</h6>
                  <p className="fs-6 lh-base text-break">
                    {
                      <Badge bg={setPriority(BioReport.equipmentPriority)}>
                        {t(`biomech.priority.${BioReport.equipmentPriority}`)}
                      </Badge>
                    }
                  </p>
                  <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.issue')}</h6>
                  <p className="fs-6 lh-base text-break">{BioReport.equipmentFault}</p>
                </div>
                <div className="w-100 pl-2">
                  <div className="broken-kit-image-container">
                    <img
                      src={BioReportImage}
                      className={`broken-kit-image img-thumbnail img-fluid mt-3 mb-3 ${
                        BioReport.imgPath ? 'd-block' : 'd-none'
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
        </div>
      </main>
    </div>
  );
};
