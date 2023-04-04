import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const UIContext = createContext<any>({} as any);

const useUIProvider = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem('language') ?? 'en');

  const changeLanguage = (ln: string) => {
    console.log(ln);
    localStorage.setItem('language', ln);
    setLang(ln);
  };

  useEffect(() => {
    const changeLang = async () => {
      console.log('render');
      await i18n.changeLanguage(lang);
    };
    changeLang();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
