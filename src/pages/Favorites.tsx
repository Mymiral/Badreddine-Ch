import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/BackButton';

const Favorites = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">{t('nav.favorites', 'Favorites')}</h1>
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <p className="text-muted-foreground">You haven't added any properties to your favorites yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
