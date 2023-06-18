import i18n from 'i18next';
//import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-node-fs-backend';

import translationEN from '../dist/client/src/locales/en/translationEN.json';
import translationFR from '../dist/client/src/locales/fr/translationFR.json';

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
};

//i18n.use(initReactI18next).init({
i18n
.use(Backend)
.init({
  resources,
  lng: 'en',
  fallbackLng: 'fr',

  backend: {
      // Configure the backend to load translations from files
      loadPath: '../../client/src/locales/fr/translationFR.json',
    },

  keySeparator: '.',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
