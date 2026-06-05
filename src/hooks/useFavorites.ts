import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = localStorage.getItem('darlink_favorites');
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing favorites", e);
        }
      }
    };
    
    loadFavorites();
    
    window.addEventListener('storage', loadFavorites);
    window.addEventListener('favoritesChanged', loadFavorites);
    
    return () => {
      window.removeEventListener('storage', loadFavorites);
      window.removeEventListener('favoritesChanged', loadFavorites);
    };
  }, []);

  const toggleFavorite = (id: string, e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(id)) {
        newFavorites = prev.filter(favId => favId !== id);
      } else {
        newFavorites = [...prev, id];
      }
      localStorage.setItem('darlink_favorites', JSON.stringify(newFavorites));
      // Dispatch custom event so other components in the same window sync
      window.dispatchEvent(new Event('favoritesChanged'));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
