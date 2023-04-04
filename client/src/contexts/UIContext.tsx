import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const UIContext = createContext<any>({} as any);

const useUIProvider = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (ln, i18n) => {
    return () => {
      i18n.changeLanguage(ln);
    };
  };

  useEffect(() => {}, []);

  return {
    changeLanguage,
  };
};

export function useUI() {
  const context = useContext<any>(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
}

export const UIProvider = ({ children }) => {
  const value = useUIProvider();
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
