import './view.css';

import { Badge, Button } from 'react-bootstrap';
import { BioReportIdParams, Paths } from 'constants/paths';
import { ENDPOINT_BIOMECH_GET_BY_ID, ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { PriorityBadge, StatusBadge } from './utils';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { FormDisplay } from 'components/form/FormDisplay';
import { FormFieldDisplay } from 'components/form/FormFieldDisplay';
import { History } from 'history';
import { ImageDisplay } from 'components/form/ImageDisplay';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BiomechGet } from 'constants/jsons';
import { BiomechPriority, BiomechStatus } from './typing';

const ALT_MESSAGE: string = 'Broken kit report...';

export const BrokenKitView = () => {
  const { bioId: id } = useParams<BioReportIdParams>();
  const { t } = useTranslation();

  const [bioReport, setBioReport] = useState<BiomechGet>();
  const [bioReportImage, setBioReportImage] = useState<string>('');

  const history: History = useHistory<History>();

  useEffect(() => {
    const getBioReport = async (controller: AbortController) => {
      const report: BiomechGet = await Api.Get(
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
      if (bioReport?.imgPath) {
        setBioReportImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(bioReport.imgPath), history));
      }
    };

    getBioReportImage();
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
        <FormDisplay>
          <div className="w-100 pr-2 d-flex flex-column gap-4">
            <FormFieldDisplay label={t('biomech.view_report.equipment_name')}>
              {bioReport.equipmentName}
            </FormFieldDisplay>

            <FormFieldDisplay label={t('biomech.view_report.issue')}>
              {bioReport.equipmentFault}
            </FormFieldDisplay>

            <FormFieldDisplay label={t('biomech.view_report.priority')}>
              <Badge bg={PriorityBadge[bioReport.equipmentPriority as BiomechPriority]}>
                {t(`biomech.priority.${bioReport.equipmentPriority}`)}
              </Badge>
            </FormFieldDisplay>

            <FormFieldDisplay label={t('biomech.view_report.status')}>
              <Badge bg={StatusBadge[bioReport.equipmentStatus as BiomechStatus]}>
                {t(`biomech.status.${bioReport.equipmentStatus}`)}
              </Badge>
            </FormFieldDisplay>

            <FormFieldDisplay label={t('biomech.view_report.author')}>
              {bioReport.user ? bioReport.user.name : t('status.not_available')}
            </FormFieldDisplay>

            <FormFieldDisplay label={t('biomech.view_report.created_at')}>
              {bioReport.createdAt}
            </FormFieldDisplay>
          </div>

          {bioReportImage && <ImageDisplay image={bioReportImage} altMessage={ALT_MESSAGE} />}
        </FormDisplay>
      </Layout>
    )
  );
};
