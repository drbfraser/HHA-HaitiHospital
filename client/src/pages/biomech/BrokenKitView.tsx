import './view.css';

import { Badge, Button, Image } from 'react-bootstrap';
import { BioReportIdParams, Paths } from 'constants/paths';
import { ENDPOINT_BIOMECH_GET_BY_ID, ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { PriorityBadge, StatusBadge } from './utils';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { History } from 'history';
import ImageModal from 'components/popup_modal/ImageModal';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ALT_MESSAGE: string = 'Broken kit report...';

const FormattedField = ({ label, value }) => (
  <div className="d-flex flex-column gap-1">
    <small className="text-muted">{label}:</small>
    <strong>{value}</strong>
  </div>
);

export const BrokenKitView = () => {
  const { bioId: id } = useParams<BioReportIdParams>();
  const { t } = useTranslation();

  const [bioReport, setBioReport] = useState<any>({});
  const [bioReportImage, setBioReportImage] = useState<string>('');

  const [isImageModelOpen, setIsImageModalOpen] = useState<boolean>(false);

  const history: History = useHistory<History>();

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setIsImageModalOpen(true);
  };

  const onModalImageClose = () => {
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    const getBioReport = async (controller: AbortController) => {
      const report = await Api.Get(
        ENDPOINT_BIOMECH_GET_BY_ID(id),
        ResponseMessage.getMsgFetchReportFailed(),
        history,
        controller.signal,
      );
      setBioReport(report);
    };

    const controller = new AbortController();
    getBioReport(controller);

    return () => {
      controller.abort();
    };
  }, [history, id]);

  useEffect(() => {
    const getBioReportImage = async () => {
      setBioReportImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(bioReport.imgPath), history));
    };

    bioReport.imgPath && getBioReportImage();
  }, [bioReport, history]);

  return (
    bioReport && (
      <Layout
        showBackButton
        title={t('biomech.view_report.title')}
        additionalButtons={
          <Button
            className="mb-3"
            onClick={() => {
              history.push(`${Paths.getBioMechEditId(bioReport.id)}`);
            }}
          >
            Edit
          </Button>
        }
      >
        <ImageModal
          show={isImageModelOpen}
          item={ALT_MESSAGE}
          image={bioReportImage}
          onModalClose={onModalImageClose}
        ></ImageModal>

        <div className="d-flex flex-row">
          <div className="w-100 pr-2 d-flex flex-column gap-4">
            <FormattedField
              label={t('biomech.view_report.equipment_name')}
              value={bioReport.equipmentName}
            />
            <FormattedField
              label={t('biomech.view_report.issue')}
              value={bioReport.equipmentFault}
            />
            <FormattedField
              label={t('biomech.view_report.priority')}
              value={
                <Badge bg={PriorityBadge[bioReport.equipmentPriority]}>
                  {t(`biomech.priority.${bioReport.equipmentPriority}`)}
                </Badge>
              }
            />
            <FormattedField
              label={t('biomech.view_report.status')}
              value={
                <Badge bg={StatusBadge[bioReport.equipmentStatus]}>
                  {t(`biomech.status.${bioReport.equipmentStatus}`)}
                </Badge>
              }
            />
            <FormattedField
              label={t('biomech.view_report.author')}
              value={bioReport.user ? bioReport.user.name : t('status.not_available')}
            />
            <FormattedField
              label={t('biomech.view_report.created_at')}
              value={bioReport.createdAt}
            />
          </div>

          {bioReportImage && (
            <Image
              src={bioReportImage}
              style={{ maxWidth: '400px', width: '100%', maxHeight: '500', cursor: 'pointer' }}
              alt={ALT_MESSAGE}
              className="d-flex mx-auto ms-xl-auto mt-3 mb-3"
              onClick={(event: any) => {
                onEnlargeImage(event);
              }}
            />
          )}
        </div>
      </Layout>
    )
  );
};
