import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { wilayas } from '@/data/wilayas';
import { useTranslation } from 'react-i18next';

interface LocationSelectorProps {
  onLocationChange?: (location: { wilaya: string; commune: string }) => void;
  initialWilaya?: string;
  initialCommune?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationChange,
  initialWilaya = '',
  initialCommune = ''
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [selectedWilaya, setSelectedWilaya] = useState(initialWilaya);
  const [selectedCommune, setSelectedCommune] = useState(initialCommune);
  
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');

  const filteredWilayas = useMemo(() => {
    return wilayas.filter(w => 
      w.name_fr.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
      w.name_ar.includes(wilayaSearch) ||
      w.code.includes(wilayaSearch)
    );
  }, [wilayaSearch]);

  const currentWilaya = useMemo(() => {
    return wilayas.find(w => w.code === selectedWilaya || w.name_fr === selectedWilaya || w.name_ar === selectedWilaya);
  }, [selectedWilaya]);

  const filteredCommunes = useMemo(() => {
    if (!currentWilaya) return [];
    return currentWilaya.communes.filter(c => 
      c.name_fr.toLowerCase().includes(communeSearch.toLowerCase()) ||
      c.name_ar.includes(communeSearch)
    );
  }, [currentWilaya, communeSearch]);

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWilaya = e.target.value;
    setSelectedWilaya(newWilaya);
    setSelectedCommune(''); // Reset commune when wilaya changes
    if (onLocationChange) {
      onLocationChange({ wilaya: newWilaya, commune: '' });
    }
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCommune = e.target.value;
    setSelectedCommune(newCommune);
    if (onLocationChange) {
      onLocationChange({ wilaya: selectedWilaya, commune: newCommune });
    }
  };

  return (
    <div className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-brand-accent" />
        <h3 className="text-lg font-bold">{t('publish.location', 'Location')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wilaya Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">
            {isArabic ? 'الولاية' : 'Wilaya'}
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isArabic ? 'ابحث عن ولاية...' : 'Search Wilaya...'}
              value={wilayaSearch}
              onChange={(e) => setWilayaSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 mb-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all text-sm"
            />
          </div>

          <select
            value={selectedWilaya}
            onChange={handleWilayaChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none cursor-pointer"
          >
            <option value="">{isArabic ? 'اختر الولاية' : 'Select Wilaya'}</option>
            {filteredWilayas.map(w => (
              <option key={w.code} value={w.code}>
                {w.code} - {isArabic ? w.name_ar : w.name_fr}
              </option>
            ))}
          </select>
        </div>

        {/* Commune Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">
            {isArabic ? 'البلدية' : 'Commune'}
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isArabic ? 'ابحث عن بلدية...' : 'Search Commune...'}
              value={communeSearch}
              onChange={(e) => setCommuneSearch(e.target.value)}
              disabled={!selectedWilaya}
              className="w-full pl-9 pr-4 py-2 mb-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <select
            value={selectedCommune}
            onChange={handleCommuneChange}
            disabled={!selectedWilaya}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{isArabic ? 'اختر البلدية' : 'Select Commune'}</option>
            {filteredCommunes.map((c, idx) => (
              <option key={idx} value={c.name_fr}>
                {isArabic ? c.name_ar : c.name_fr}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
