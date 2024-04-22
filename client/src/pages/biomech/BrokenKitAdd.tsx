import { BiomechForm } from './typing';
import BrokenKitForm from 'components/bio_support/BrokenKitForm';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addBiomech } from 'api/biomech';

export const BrokenKitAdd = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();

  const onSubmitAction = () => {
    history.push(Paths.getBioMechMain());
  };

  const handleSubmit = async (data: BiomechForm) => {
    addBiomech(data, onSubmitAction, history);
  };

  return (
    <Layout showBackButton title={t('headerBiomechanicalSupportForm')}>
      <BrokenKitForm onSubmit={handleSubmit} />
    </Layout>
  );
};
