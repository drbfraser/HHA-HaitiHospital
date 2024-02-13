import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translationEN.json';
import translationFR from './locales/fr/translationFR.json';

import nicuModelEn from './models/nicuModel.json';
import nicuModelFr from './models/nicuModelFr.json';

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: ['en', 'fr'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
