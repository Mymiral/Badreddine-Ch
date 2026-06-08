import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'ar' | 'en' | 'tzm';
type Currency = 'DZD' | 'EUR' | 'USD';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>((i18n.language as Language) || 'fr');
  const [currency, setCurrency] = useState<Currency>('DZD');

  useEffect(() => {
    setLanguageState((i18n.language as Language) || 'fr');
  }, [i18n.language]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  const formatDzdPrice = (price: number, localeStr: string) => {
    if (price >= 1_000_000_000) {
      return `${new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 2 }).format(price / 1_000_000_000)} milliard DZD`;
    }

    if (price >= 1_000_000) {
      return `${new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 2 }).format(price / 1_000_000)} million DZD`;
    }

    return new Intl.NumberFormat(localeStr, {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPrice = (price: number) => {
    const eurExchangeRate = 240;
    const usdExchangeRate = 220;
    
    // For ar and tzm we might use ar-DZ, else fr-DZ/en-US
    const localeStr = language === 'fr' ? 'fr-DZ' : ['ar', 'tzm'].includes(language) ? 'ar-DZ' : 'en-US';
    const frLocale = language === 'fr' ? 'fr-FR' : localeStr;
    
    if (currency === 'EUR') {
      return new Intl.NumberFormat(frLocale, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(price / eurExchangeRate);
    }
    
    if (currency === 'USD') {
      return new Intl.NumberFormat(frLocale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(price / usdExchangeRate);
    }

    return formatDzdPrice(price, localeStr);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, formatPrice }}>
      <div dir={['ar', 'tzm'].includes(language) ? 'rtl' : 'ltr'} className={['ar', 'tzm'].includes(language) ? 'font-arabic' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
