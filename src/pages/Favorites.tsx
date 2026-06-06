import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { supabase } from '@/supabase';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useApp } from '@/contexts/AppContext';

const mapProperty = (item: any) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  price: Number(item.price),
  location: item.location,
  city: item.city,
  type: item.type,
  propertyType: item.property_type || item.propertyType,
  bedrooms: item.bedrooms,
  bathrooms: item.bathrooms,
  area: item.area,
  images: item.images || [],
  featured: item.featured,
  createdAt: item.created_at,
  agentId: item.agent_id || item.agentId,
});

const Favorites = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formatPrice } = useApp();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (!user) {
        setProperties([]);
        setLoading(false);
        return;
      }

      if (favoriteIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: supaErr } = await supabase
          .from('properties')
          .select('*')
          .in('id', favoriteIds);

        if (supaErr) throw supaErr;

        const byFavoriteOrder = new Map(favoriteIds.map((id, index) => [id, index]));
        setProperties((data || []).map(mapProperty).sort((a, b) => {
          const aIndex = byFavoriteOrder.get(a.id) ?? 0;
          const bIndex = byFavoriteOrder.get(b.id) ?? 0;
          return Number(aIndex) - Number(bIndex);
        }));
        setError(null);
      } catch (err) {
        console.error('Error fetching favorite properties:', err);
        setError('Failed to load your favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [user, favoriteIds]);

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-background">
        <div className="container-custom max-w-4xl">
          <BackButton />
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-3">{t('nav.favorites', 'Favorites')}</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your favorite properties.</p>
            <Link to="/login" className="inline-flex bg-brand-accent text-brand-primary px-6 py-3 rounded-lg font-medium hover:bg-brand-accent/90 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-6xl">
        <BackButton />
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{t('nav.favorites', 'Favorites')}</h1>
            <p className="text-muted-foreground">{properties.length} saved properties</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">You haven't added any properties to your favorites yet.</p>
            <Link to="/properties" className="inline-flex bg-brand-accent text-brand-primary px-6 py-3 rounded-lg font-medium hover:bg-brand-accent/90 transition-colors">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/property/${property.id}`} className="block relative aspect-video">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${property.type === 'sale' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-secondary text-brand-white'}`}>
                    {property.type === 'sale' ? t('properties.sale') : t('properties.rent')}
                  </span>
                </Link>

                <div className="p-6">
                  <Link to={`/property/${property.id}`} className="block font-bold text-lg mb-2 line-clamp-1 hover:text-brand-accent transition-colors" title={property.title}>
                    {property.title}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    <span className="truncate">{property.location}{property.city ? `, ${property.city}` : ''}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-bold text-brand-primary dark:text-white">{formatPrice(property.price)}</span>
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
