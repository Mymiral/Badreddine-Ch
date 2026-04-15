import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProperties } from '@/context/PropertyContext';
import { wilayas } from '@/data/wilayas';

interface LiveSearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
  showChip?: boolean;
}

export const LiveSearchBar: React.FC<LiveSearchBarProps> = ({ 
  initialValue = '', 
  onSearch,
  className = '',
  placeholder,
  showChip = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { properties } = useProperties();
  
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic
  const searchAnnouncements = (q: string, announcements: any[]) => {
    const queryLower = q.toLowerCase().trim();
    return announcements.filter(a =>
      a.city?.toLowerCase().includes(queryLower) ||
      a.location?.toLowerCase().includes(queryLower) ||
      a.title?.toLowerCase().includes(queryLower)
    );
  };

  const getSuggestions = () => {
    if (debouncedQuery.length < 2) return { wilayas: [], communes: [] };
    
    const q = debouncedQuery.toLowerCase().trim();
    
    const matchedWilayas = wilayas.filter(w => 
      w.name_fr.toLowerCase().includes(q) || 
      w.name_ar.includes(q)
    ).map(w => {
      const count = searchAnnouncements(w.name_fr, properties).length;
      return { name: w.name_fr, nameAr: w.name_ar, count };
    }).filter(w => w.count > 0).slice(0, 5);

    const matchedCommunes: any[] = [];
    wilayas.forEach(w => {
      w.communes.forEach(c => {
        if (c.name_fr.toLowerCase().includes(q) || c.name_ar.includes(q)) {
          const count = searchAnnouncements(c.name_fr, properties).length;
          if (count > 0) {
            matchedCommunes.push({ name: c.name_fr, nameAr: c.name_ar, wilaya: w.name_fr, count });
          }
        }
      });
    });

    return { 
      wilayas: matchedWilayas, 
      communes: matchedCommunes.sort((a, b) => b.count - a.count).slice(0, 5) 
    };
  };

  const suggestions = getSuggestions();
  const hasSuggestions = suggestions.wilayas.length > 0 || suggestions.communes.length > 0;
  const totalResults = searchAnnouncements(debouncedQuery, properties).length;

  const handleSelect = (value: string) => {
    setQuery(value);
    setIsOpen(false);
    if (onSearch) {
      onSearch(value);
    } else {
      // If no onSearch provided, navigate to properties page
      const params = new URLSearchParams(location.search);
      params.set('location', value);
      navigate(`/properties?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    } else {
      const params = new URLSearchParams(location.search);
      params.delete('location');
      navigate(`/properties?${params.toString()}`);
    }
  };

  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Trigger search on debounce if onSearch is provided
  useEffect(() => {
    if (onSearchRef.current) {
      if (debouncedQuery.length >= 2) {
        onSearchRef.current(debouncedQuery);
      } else if (debouncedQuery.length === 0) {
        onSearchRef.current('');
      }
    }
  }, [debouncedQuery]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-accent" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t('hero.search.locationPlaceholder')}
          className="w-full pl-12 pr-10 py-3.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all text-foreground"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showChip && initialValue && (
        <div className="mt-3 flex items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-accent/10 text-brand-primary rounded-full text-sm font-medium border border-brand-accent/20">
            <MapPin className="w-3.5 h-3.5" />
            {initialValue}
            <button onClick={clearSearch} className="hover:text-brand-accent ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {hasSuggestions ? (
            <div className="py-2">
              {suggestions.wilayas.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Wilayas</div>
                  {suggestions.wilayas.map((w, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(w.name)}
                      className="w-full text-left px-4 py-2 hover:bg-muted flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium">{w.name} <span className="text-muted-foreground text-sm ml-1">({w.nameAr})</span></span>
                      <span className="text-xs bg-brand-accent/10 text-brand-primary px-2 py-1 rounded-full">{w.count} annonces</span>
                    </button>
                  ))}
                </div>
              )}
              
              {suggestions.communes.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Communes</div>
                  {suggestions.communes.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(c.name)}
                      className="w-full text-left px-4 py-2 hover:bg-muted flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-medium">{c.name} <span className="text-muted-foreground text-sm ml-1">({c.nameAr})</span></span>
                        <div className="text-xs text-muted-foreground">{c.wilaya}</div>
                      </div>
                      <span className="text-xs bg-brand-accent/10 text-brand-primary px-2 py-1 rounded-full">{c.count} annonces</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {t('common.noResults', 'Aucune annonce trouvée pour cette localisation')}
            </div>
          )}
          
          <div className="bg-muted/50 px-4 py-3 border-t border-border text-sm text-center text-muted-foreground">
            {totalResults} {t('common.announcementsFound', 'annonces trouvées')} {query && `à ${query}`}
          </div>
        </div>
      )}
    </div>
  );
};
