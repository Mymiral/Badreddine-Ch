import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/BackButton';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useProperties } from '@/context/PropertyContext';
import { motion } from 'motion/react';

const Favorites = () => {
  const { t } = useTranslation();
  const { favorites } = useFavorites();
  const { properties, loading } = useProperties();

  const favoritedProperties = properties.filter((property: any) => favorites.includes(property.id));

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-6xl">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">{t('nav.favorites', 'Favorites')}</h1>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favoritedProperties.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <p className="text-muted-foreground">{t('favorites.empty', "You haven't added any properties to your favorites yet.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedProperties.map((property: any, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
