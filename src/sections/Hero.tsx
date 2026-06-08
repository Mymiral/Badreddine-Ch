import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LiveSearchBar } from '@/components/LiveSearchBar';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    type: '',
    budget: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to properties page with search params
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.budget) params.append('budget', searchParams.budget);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
          alt="Luxury Villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/70 to-transparent"></div>
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="transform -skew-x-6 mb-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] tracking-tighter uppercase">
                {t('hero.title1')} <br />
                <span className="text-brand-accent">{t('hero.title2')}</span> <br />
                {t('hero.title3')}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-display font-bold text-brand-accent mb-1 tracking-tighter">10k+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{t('hero.stats.properties')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-display font-bold text-brand-accent mb-1 tracking-tighter">48</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{t('hero.stats.cities')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-display font-bold text-brand-accent mb-1 tracking-tighter">5k+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{t('hero.stats.clients')}</span>
              </div>
            </div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            <form onSubmit={handleSearch} className="flex flex-col gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  {t('hero.search.location')}
                </label>
                <LiveSearchBar
                  initialValue={searchParams.location}
                  onSearch={(val, selection) => {
                    const newParams = { ...searchParams, location: val };
                    if (selection?.type === 'wilaya') {
                      newParams.wilaya = selection.wilayaCode || '';
                      newParams.commune = '';
                    } else if (selection?.type === 'commune') {
                      newParams.commune = selection.name;
                      if (selection.wilayaCode) {
                        newParams.wilaya = selection.wilayaCode;
                      }
                    }
                    if (!val) {
                      delete newParams.wilaya;
                      delete newParams.commune;
                    }
                    setSearchParams(newParams);
                  }}
                  placeholder={t('hero.search.locationPlaceholder')}
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-brand-accent" />
                  {t('hero.search.type')}
                </label>
                <select
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                  className="w-full bg-white/90 border-0 rounded-lg px-4 py-3.5 text-brand-primary focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                >
                  <option value="">{t('hero.search.allTypes')}</option>
                  <option value="apartment">{t('hero.search.apartment')}</option>
                  <option value="villa">{t('hero.search.villa')}</option>
                  <option value="studio">{t('hero.search.studio')}</option>
                  <option value="land">{t('hero.search.land')}</option>
                  <option value="office">{t('hero.search.office')}</option>
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <span className="w-4 h-4 text-brand-accent mr-4">Dzd</span>
                  {t('hero.search.budget')}
                </label>
                <select
                  value={searchParams.budget}
                  onChange={(e) => setSearchParams({ ...searchParams, budget: e.target.value })}
                  className="w-full bg-white/90 border-0 rounded-lg px-4 py-3.5 text-brand-primary focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                >
                  <option value="">{t('hero.search.allPrices')}</option>
                  <option value="0-5000000">0 - 5,000,000 DZD</option>
                  <option value="5000000-15000000">5,000,000 - 15,000,000 DZD</option>
                  <option value="15000000-30000000">15,000,000 - 30,000,000 DZD</option>
                  <option value="30000000+">30,000,000+ DZD</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand-accent text-brand-primary font-bold text-lg py-4 rounded-lg mt-2 hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {t('hero.search.searchButton')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
