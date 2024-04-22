import './view.css';

import { Badge, Button } from 'react-bootstrap';
import { BioReportIdParams, Paths } from 'constants/paths';
import { PriorityBadge, StatusBadge } from './utils';
import { useCallback, useEffect, useState } from 'react';
import { FormDisplay } from 'components/form/FormDisplay';
import { FormFieldDisplay } from 'components/form/FormFieldDisplay';
import { History } from 'history';
import { ImageDisplay } from 'components/form/ImageDisplay';
import Layout from 'components/layout';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BiomechPriority, BiomechStatus, BiomechJson as Biomech } from '@hha/common';
import { getBiomechById } from 'api/biomech';
import { getImage } from 'api/image';
import { toI18nDateString } from 'constants/date';

const ALT_MESSAGE: string = 'Broken kit report...';

export const BrokenKitView = () => {
  const { bioId: id } = useParams<BioReportIdParams>();
  const { t, i18n } = useTranslation();

  const [bioReport, setBioReport] = useState<Biomech>();
  const [bioReportImage, setBioReportImage] = useState<string>('');

  const history: History = useHistory<History>();

  const getABiomech = useCallback(async () => {
    const biomech = await getBiomechById(id, history);
    setBioReport(biomech);
  }, [id, history]);

  const getABiomechImage = useCallback(async () => {
    if (bioReport) {
      const biomechImg = await getImage(bioReport.imgPath, history);
      setBioReportImage(biomechImg);
    }
  }, [bioReport, history]);

  useEffect(() => {
    getABiomech();
  }, [getABiomech]);

  useEffect(() => {
    getABiomechImage();
  }, [getABiomechImage]);

  return (
    <Layout
      showBackButton
      title={t('biomech.view_report.title')}
      additionalButtons={
        <Button
          className="mb-3"
          onClick={() => {
            if (bioReport) {
              history.push(`${Paths.getBioMechEditId(bioReport.id)}`);
            }
          }}
        >
          Edit
        </Button>
      }
    >
      {bioReport && (
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
              {toI18nDateString(bioReport.createdAt, i18n.resolvedLanguage)}
            </FormFieldDisplay>
          </div>

          {bioReportImage && <ImageDisplay image={bioReportImage} altMessage={ALT_MESSAGE} />}
        </FormDisplay>
      )}
    </Layout>
  );
};
