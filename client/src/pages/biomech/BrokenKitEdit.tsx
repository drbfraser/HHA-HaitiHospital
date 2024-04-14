import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BioReportIdParams } from 'constants/paths';
import { BiomechForm } from './typing';
import BrokenKitForm from 'components/bio_support/BrokenKitForm';
import { History } from 'history';
import Layout from 'components/layout';
import { useTranslation } from 'react-i18next';
import { getBiomechFormById, updateBiomech } from 'api/biomech';

export const BrokenKitEdit = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const { bioId: id } = useParams<BioReportIdParams>();
  const [bioReport, setBioReport] = useState<BiomechForm>();

  const submitAction = () => history.goBack();

  const onSubmit = async (data: BiomechForm) => {
    updateBiomech(id, data, submitAction, history);
  };

  const getABiomech = useCallback(async () => {
    const biomechForm = await getBiomechFormById(id, history);
    setBioReport(biomechForm);
  }, [id, history]);

  useEffect(() => {
    getABiomech();
  }, [getABiomech]);

  return (
    <Layout showBackButton title={t('headerBiomechanicalSupportForm')}>
      {bioReport && <BrokenKitForm onSubmit={onSubmit} biomechForm={bioReport} />}
    </Layout>
  );
};
