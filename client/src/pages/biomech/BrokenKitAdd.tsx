import Api from '../../actions/Api';
import { BiomechForm } from './typing';
import BrokenKitForm from 'components/bio_support/BrokenKitForm';
import { ENDPOINT_BIOMECH_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const BrokenKitAdd = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();

  const onSubmit = async (data: BiomechForm) => {
    // Parse to FormData() to support multipart/data-form form
    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key as keyof BiomechForm]));

    await Api.Post(
      ENDPOINT_BIOMECH_POST,
      formData,
      () => history.push(Paths.getBioMechMain()),
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      undefined,
      ResponseMessage.getMsgCreateReportOk(),
    );
  };

  return (
    <Layout showBackButton title={t('headerBiomechanicalSupportForm')}>
      <BrokenKitForm onSubmit={onSubmit} />
    </Layout>
  );
};
