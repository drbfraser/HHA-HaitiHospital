import { useTranslation } from 'react-i18next';

const DraftIcon = () => {
  const { t } = useTranslation();

  return (
    <span className="border border-danger rounded p-1 mr-2 text-danger">{t('reportDraft')}</span>
  );
};

export default DraftIcon;
