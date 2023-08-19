import { ENDPOINT_BIOMECH_GET_BY_ID, ENDPOINT_BIOMECH_UPDATE_BY_ID } from 'constants/endpoints';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Api from '../../actions/Api';
import { BioReportIdParams } from 'constants/paths';
import { BiomechForm } from './typing';
import BrokenKitForm from 'components/bio_support/BrokenKitForm';
import { History } from 'history';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useTranslation } from 'react-i18next';

export const BrokenKitEdit = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const { bioId: id } = useParams<BioReportIdParams>();
  const [bioReport, setBioReport] = useState<BiomechForm>();

  const onSubmit = async (data: BiomechForm) => {
    // Parse to FormData() to support multipart/data-form form
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await Api.Put(
      ENDPOINT_BIOMECH_UPDATE_BY_ID(id),
      formData,
      () => history.goBack(),
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      null,
      ResponseMessage.getMsgCreateReportOk(),
    );
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

  return (
    <Layout showBackButton title={t('headerBiomechanicalSupportForm')}>
      {bioReport && <BrokenKitForm onSubmit={onSubmit} biomechForm={bioReport} />}
    </Layout>
  );
};
