import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/supabase';
import { useAuth } from '@/context/AuthContext';

interface FavoritesContextType {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFavorites = async () => {
    if (!user) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('uid', user.uid);

      if (error) throw error;

      setFavoriteIds((data || []).map((favorite) => favorite.property_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [user]);

  const isFavorite = (propertyId: string) => favoriteIds.includes(propertyId);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      alert('Please log in to save favorites.');
      return;
    }

    const wasFavorite = isFavorite(propertyId);
    setFavoriteIds((current) =>
      wasFavorite ? current.filter((id) => id !== propertyId) : [...current, propertyId]
    );

    try {
      if (wasFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('uid', user.uid)
          .eq('property_id', propertyId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ uid: user.uid, property_id: propertyId });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavoriteIds((current) =>
        wasFavorite ? [...current, propertyId] : current.filter((id) => id !== propertyId)
      );
      alert('Failed to update favorites. Please try again.');
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, loading, isFavorite, toggleFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
