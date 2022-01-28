import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translationEN.json';
import translationFR from './locales/fr/translationFR.json';

import nicuModelEn from './pages/form/models/nicuModel.json';
import nicuModelFr from './pages/form/models/nicuModelFr.json';

const resources = {
  en: {
    translation: translationEN,
    formTranslation: nicuModelEn,
  },
  fr: {
    translation: translationFR,
    formTranslation: nicuModelFr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
