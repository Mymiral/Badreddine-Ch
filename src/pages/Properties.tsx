import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, Map as MapIcon, Grid } from 'lucide-react';
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import AlgeriaMapFilter from '@/components/AlgeriaMapFilter';
import { PropertiesMap } from '@/components/PropertiesMap';

import { LiveSearchBar } from '@/components/LiveSearchBar';
import AlertModal from '@/components/AlertModal';
import { Bell } from 'lucide-react';

import { wilayas } from '@/data/wilayas';

const Properties = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading, error } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [showFilters, setShowFilters] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter states
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    wilaya: searchParams.get('wilaya') || '',
    commune: searchParams.get('commune') || '',
    type: searchParams.get('type') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    minArea: '',
    maxArea: '',
  });

  useEffect(() => {
    // Apply filters whenever properties or filters change
    let result = [...properties];

    if (filters.location) {
      const q = filters.location.toLowerCase().trim();
      result = result.filter(a =>
        a.city?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.title?.toLowerCase().includes(q)
      );
    }

    if (filters.wilaya) {
      // Find wilaya name to match against property location
      const wilayaName = wilayas.find((w: any) => w.code === filters.wilaya)?.name_fr || filters.wilaya;
      result = result.filter(p => p.location.toLowerCase().includes(wilayaName.toLowerCase()) || p.city?.toLowerCase().includes(wilayaName.toLowerCase()));
    }
    if (filters.commune) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.commune.toLowerCase()) || p.city?.toLowerCase().includes(filters.commune.toLowerCase()));
    }
    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms >= Number(filters.bedrooms));
    }
    if (filters.minArea) {
      result = result.filter(p => p.area >= Number(filters.minArea));
    }
    if (filters.maxArea) {
      result = result.filter(p => p.area <= Number(filters.maxArea));
    }

    setFilteredProperties(result);
  }, [properties, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL params
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const handleWilayaSelect = (wilaya: string) => {
    setFilters(prev => ({ ...prev, wilaya, commune: '' }));
    if (wilaya) {
      searchParams.set('wilaya', wilaya);
    } else {
      searchParams.delete('wilaya');
    }
    searchParams.delete('commune');
    setSearchParams(searchParams);
  };

  const handleLocationChange = ({ wilaya, commune }: { wilaya: string; commune: string }) => {
    setFilters(prev => ({ ...prev, wilaya, commune }));
    if (wilaya) searchParams.set('wilaya', wilaya);
    else searchParams.delete('wilaya');
    
    if (commune) searchParams.set('commune', commune);
    else searchParams.delete('commune');
    
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      wilaya: '',
      commune: '',
      type: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      minArea: '',
      maxArea: '',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-brand-primary">
              {t('nav.properties')}
            </h1>
            <p className="text-muted-foreground">
              {filteredProperties.length} {t('agents.properties')} {t('common.found', 'trouvées')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-primary font-medium rounded-lg hover:bg-brand-accent/90 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="hidden md:inline">{t('common.createAlert', 'Créer une alerte')}</span>
            </button>
            <div className="hidden md:flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid className="w-4 h-4" />
                {t('common.grid', 'Grille')}
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <MapIcon className="w-4 h-4" />
                {t('common.map', 'Carte Interactive')}
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors md:hidden"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('common.filters', 'Filtres')}
            </button>
          </div>
        </div>

        {viewMode === 'map' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <AlgeriaMapFilter 
              properties={properties} 
              selectedWilaya={filters.wilaya} 
              onWilayaSelect={handleWilayaSelect} 
            />
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {t('common.filters', 'Filtres')}
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-accent hover:underline"
                >
                  {t('common.clear', 'Effacer')}
                </button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('publish.location', 'Location')}</label>
                  <LiveSearchBar 
                    initialValue={filters.location}
                    onSearch={(val) => {
                      setFilters(prev => ({ ...prev, location: val }));
                      if (val) searchParams.set('location', val);
                      else searchParams.delete('location');
                      setSearchParams(searchParams);
                    }}
                    showChip={true}
                  />
                </div>

                {/* Transaction Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('publish.transactionType')}</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                  >
                    <option value="">{t('hero.search.allTypes')}</option>
                    <option value="sale">{t('publish.sale')}</option>
                    <option value="rent">{t('publish.rent')}</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('hero.search.type')}</label>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                  >
                    <option value="">{t('hero.search.allTypes')}</option>
                    <option value="apartment">{t('hero.search.apartment')}</option>
                    <option value="villa">{t('hero.search.villa')}</option>
                    <option value="studio">{t('hero.search.studio')}</option>
                    <option value="land">{t('hero.search.land')}</option>
                    <option value="office">{t('hero.search.office')}</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('publish.price')} (DZD)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder={t('min_price')}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder={t('max_price')}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('publish.bedrooms')}</label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                  >
                    <option value="">{t('hero.search.allTypes')}</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Surface Area */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('surface')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minArea"
                      value={filters.minArea}
                      onChange={handleFilterChange}
                      placeholder={t('min_surface')}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      name="maxArea"
                      value={filters.maxArea}
                      onChange={handleFilterChange}
                      placeholder={t('max_surface')}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid or Map */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-[4/3] bg-muted"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-8 bg-muted rounded w-1/2 mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Aucun bien trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche pour voir plus de résultats.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-brand-accent text-brand-primary rounded-lg font-medium hover:bg-brand-accent/90 transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <PropertiesMap properties={filteredProperties} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAlertModal && (
        <AlertModal onClose={() => setShowAlertModal(false)} />
      )}
    </div>
  );
};

export default Properties;
