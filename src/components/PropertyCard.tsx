import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, BedDouble, Bath, Square, Heart, ChevronLeft, ChevronRight, MessageCircle, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { DarScoreBadge } from '@/components/DarScoreBadge';
import { useApp } from '@/contexts/AppContext';
import { useFavorites } from '@/context/FavoritesContext';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    type: 'sale' | 'rent';
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    featured?: boolean;
    agent?: {
      name: string;
      verified?: boolean;
      phone?: string;
    };
  };
  highlighted?: boolean;
}

const PropertyCard = ({ property, highlighted }: PropertyCardProps) => {
  const { t } = useTranslation();
  const { formatPrice } = useApp();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const saved = isFavorite(property.id);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % (property.images.length || 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + (property.images.length || 1)) % (property.images.length || 1));
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : (property as any).image 
      ? [(property as any).image] 
      : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      animate={highlighted ? { scale: 1.02 } : { scale: 1 }}
      className={`bg-card border ${highlighted ? 'border-brand-accent shadow-xl ring-2 ring-brand-accent/50' : 'border-border shadow-sm hover:shadow-xl hover:border-brand-accent'} rounded-2xl overflow-hidden transition-all duration-300 group`}
    >
      <div className="relative aspect-[4/3] overflow-hidden group/carousel">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/70 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            property.type === 'sale' 
              ? 'bg-brand-accent text-brand-primary' 
              : 'bg-brand-secondary text-brand-white'
          }`}>
            {property.type === 'sale' ? t('properties.sale') : t('properties.rent')}
          </span>
          {property.featured && (
            <span className="bg-brand-primary text-brand-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {(property as any).video && (
            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-md">
              🎥 Vidéo
            </span>
          )}
          <DarScoreBadge property={property} />
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
          aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4 text-brand-accent" />
          <span className="truncate">{property.location}</span>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
          <Link to={`/property/${property.id}`} className="hover:underline">
            {property.title}
          </Link>
        </h3>

        {(property.agent || (property as any).agentName) && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <span className="font-medium">{property.agent?.name || (property as any).agentName}</span>
            {property.agent?.verified && (
              <BadgeCheck className="w-4 h-4 text-brand-accent" title="Agent Vérifié" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-brand-primary dark:text-white">
              {formatPrice(property.price)}
            </span>
            {property.type === 'rent' && (
              <span className="text-muted-foreground text-sm"> {t('properties.perMonth')}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-muted-foreground text-sm mb-2">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            <span>{property.bedrooms} {t('properties.beds')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} {t('properties.baths')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4" />
            <span>{property.area} {t('properties.area')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Link
            to={`/property/${property.id}`}
            className="text-sm font-medium text-brand-accent hover:text-brand-accent/80 transition-colors inline-block"
          >
            {t('properties.details')}
          </Link>
          <a 
            href={`https://wa.me/${property.agent?.phone || '213000000000'}?text=${encodeURIComponent(`Bonjour, je suis intéressé par votre annonce: ${property.title}`)}`} 
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
