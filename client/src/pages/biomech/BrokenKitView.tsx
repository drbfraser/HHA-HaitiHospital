import './view.css';

import {
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_BIOMECH_UPDATE_STATUS,
  ENDPOINT_IMAGE_BY_PATH,
} from 'constants/endpoints';
import { setPriority, setStatusBadgeColor } from 'pages/biomech/utils';
import { useEffect, useMemo, useState } from 'react';

import Api from '../../actions/Api';
import { Badge } from 'react-bootstrap';
import { BioReportIdParams } from 'constants/paths';
import { BiomechStatus } from './typing';
import { History } from 'history';
import ImageModal from 'components/popup_modal/ImageModal';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BrokenKitView = () => {
  const ALT_MESSAGE: string = 'Broken kit report...';
  const { t } = useTranslation();
  const [BioReport, setBioReport] = useState({} as any);
  const [BioReportImage, setBioReportImage] = useState<string>('');
  const [imageModal, setImageModal] = useState<boolean>(false);
  const params = useParams<BioReportIdParams>();
  const id: string = useMemo(() => params.bioId, [params.bioId]);
  const history: History = useHistory<History>();
  const [status, setStatus] = useState<BiomechStatus>(t(BiomechStatus.INPROGRESS));

  const statusArray: BiomechStatus[] = Object.values(BiomechStatus);

  const handleStatusUpdate = (status: BiomechStatus) => {
    Api.Put(
      ENDPOINT_BIOMECH_UPDATE_STATUS(id),
      { status },
      () => {},
      history,
      ResponseMessage.getMsgUpdateReportFailed(),
      ResponseMessage.getMsgUpdateReportPending(),
      ResponseMessage.getMsgUpdateReportOk(),
    );
  };

  const changeStatus = (direction: number) => {
    const index = statusArray.findIndex((el) => el === status) + direction;
    if (index < 0) setStatus(statusArray[statusArray.length - 1]);
    else if (index > statusArray.length - 1) setStatus(statusArray[0]);
    else setStatus(statusArray[index]);
  };

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
      const controller = new AbortController();
      const getBioReport = async () => {
        const report = await Api.Get(
          ENDPOINT_BIOMECH_GET_BY_ID(id),
          ResponseMessage.getMsgFetchReportFailed(),
          history,
          controller.signal,
        );
        setBioReport(report);
        setStatus(report.equipmentStatus);
      };
      getBioReport();
      return () => {
        controller.abort();
        setBioReport({} as any);
        setBioReportImage('');
      };
    },
    [history, id],
  );

  useEffect(
    function fetchImage() {
      const controller = new AbortController();
      const getBioReportImage = async () => {
        setBioReportImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(BioReport.imgPath), history));
      };

      // Only execute once biomech data has been successfully passed to this component
      if (BioReport.imgPath !== undefined) {
        getBioReportImage();
      }
      return () => {
        controller.abort();
      };
    },
    [BioReport, history],
  );

  return (
    <Layout showBackButton title={t('biomech.view_report.title')}>
      <ImageModal
        show={imageModal}
        item={ALT_MESSAGE}
        image={BioReportImage}
        onModalClose={onModalImageClose}
        history={history}
      ></ImageModal>
      <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
        <div style={{ display: 'flex', flex: '1 1 auto' }}>
          <div className="w-100 pr-2">
            <h6 className="fs-6 lh-base">
              {`${t('biomech.view_report.author')}: `}
              {BioReport.user ? BioReport.user.name : t('status.not_available')}
            </h6>
            <h6 className="fs-6 mb-3 lh-base">Date: {BioReport.createdAt}</h6>
            <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.equipment_name')}</h6>
            <p data-testid="biomech-equipment-name" className="fs-6 lh-base text-break">
              {BioReport.equipmentName}
            </p>
            <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.priority')}</h6>
            <p data-testid="biomech-priority" className="fs-6 lh-base text-break">
              {
                <Badge bg={setPriority(BioReport.equipmentPriority)}>
                  {t(`biomech.priority.${BioReport.equipmentPriority}`)}
                </Badge>
              }
            </p>
            <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.status')}</h6>
            <div className="d-flex align-items-center">
              <i
                className="bi-arrow-left h4 mr-3 mb-0"
                role="button"
                onClick={() => {
                  changeStatus(1);
                }}
              />
              <p data-testid="biomech-equipment-status" className="fs-6 lh-base text-break mb-0">
                <Badge bg={setStatusBadgeColor(status)}>{t(`biomech.status.${status}`)}</Badge>
              </p>
              <i
                className="bi-arrow-right h4 ml-3 mr-4 mb-0"
                role="button"
                onClick={() => {
                  changeStatus(-1);
                }}
              />
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  handleStatusUpdate(status);
                }}
              >
                Update Status
              </button>
            </div>
            <h6 className="fs-6 fw-bold lh-base">{t('biomech.view_report.issue')}</h6>
            <p data-testid="biomech-issue" className="fs-6 lh-base text-break">
              {BioReport.equipmentFault}
            </p>
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
    </Layout>
  );
};
