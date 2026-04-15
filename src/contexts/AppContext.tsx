import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ar' | 'en';
type Currency = 'DZD' | 'EUR';

interface Translations {
  nav: {
    properties: string;
    about: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  properties: {
    featured: string;
    featuredSubtitle: string;
    price: string;
    beds: string;
    baths: string;
    sqft: string;
    contact: string;
  };
}

const translations: Record<Language, Translations> = {
  fr: {
    nav: { properties: 'Biens', about: 'À propos', contact: 'Contact' },
    hero: { title: 'Trouvez votre demeure d\'exception', subtitle: 'Une sélection exclusive des plus beaux biens immobiliers.', cta: 'Découvrir' },
    properties: { featured: 'Biens en Vedette', featuredSubtitle: 'Découvrez notre sélection exclusive', price: 'Prix', beds: 'Chambres', baths: 'Salles de bain', sqft: 'm²', contact: 'Contacter' }
  },
  ar: {
    nav: { properties: 'العقارات', about: 'من نحن', contact: 'اتصل بنا' },
    hero: { title: 'ابحث عن منزلك الاستثنائي', subtitle: 'مجموعة حصرية من أجمل العقارات.', cta: 'اكتشف المزيد' },
    properties: { featured: 'عقارات مميزة', featuredSubtitle: 'اكتشف مجموعتنا الحصرية', price: 'السعر', beds: 'غرف', baths: 'حمامات', sqft: 'متر مربع', contact: 'اتصل' }
  },
  en: {
    nav: { properties: 'Properties', about: 'About', contact: 'Contact' },
    hero: { title: 'Find Your Exceptional Home', subtitle: 'An exclusive selection of the finest real estate.', cta: 'Discover' },
    properties: { featured: 'Featured Properties', featuredSubtitle: 'Discover our exclusive selection', price: 'Price', beds: 'Beds', baths: 'Baths', sqft: 'sqft', contact: 'Contact' }
  }
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: number) => string;
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [currency, setCurrency] = useState<Currency>('DZD');

  const formatPrice = (price: number) => {
    // Assuming 1 EUR = 240 DZD for demonstration purposes
    const exchangeRate = 240;
    
    if (currency === 'EUR') {
      return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-DZ' : 'en-US', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(price / exchangeRate);
    }

    return new Intl.NumberFormat(language === 'fr' ? 'fr-DZ' : language === 'ar' ? 'ar-DZ' : 'en-US', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, formatPrice, t: translations[language] }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
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
