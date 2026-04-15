import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, MapPin, Home, Square, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import BackButton from '@/components/BackButton';
import { useApp } from '@/contexts/AppContext';

const PriceEstimator = () => {
  const { t } = useTranslation();
  const { formatPrice } = useApp();
  const [formData, setFormData] = useState({
    wilaya: '',
    type: 'apartment',
    area: '',
    condition: 'good'
  });
  const [estimate, setEstimate] = useState<null | { min: number, max: number }>(null);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock estimation logic
    const basePricePerSqm = formData.type === 'villa' ? 150000 : 120000;
    const area = Number(formData.area) || 0;
    
    let multiplier = 1;
    if (formData.wilaya === 'Alger' || formData.wilaya === 'Oran') multiplier = 1.5;
    if (formData.condition === 'new') multiplier *= 1.2;
    if (formData.condition === 'needs_work') multiplier *= 0.8;

    const estimatedValue = basePricePerSqm * area * multiplier;
    
    setEstimate({
      min: estimatedValue * 0.9,
      max: estimatedValue * 1.1
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/20 text-brand-accent mb-6"
          >
            <Calculator className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 text-brand-primary"
          >
            {t('estimator.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('estimator.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-8 rounded-2xl shadow-sm"
          >
            <form onSubmit={handleEstimate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  {t('estimator.wilaya')}
                </label>
                <select
                  value={formData.wilaya}
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                  required
                >
                  <option value="">{t('estimator.selectWilaya')}</option>
                  <option value="Alger">Alger</option>
                  <option value="Oran">Oran</option>
                  <option value="Constantine">Constantine</option>
                  <option value="Annaba">Annaba</option>
                  <option value="Blida">Blida</option>
                  <option value="Other">Autre wilaya</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Home className="w-4 h-4 text-brand-accent" />
                  {t('estimator.propertyType')}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                >
                  <option value="apartment">{t('estimator.apartment')}</option>
                  <option value="villa">{t('estimator.villa')}</option>
                  <option value="land">{t('estimator.land')}</option>
                  <option value="commercial">{t('estimator.commercial')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Square className="w-4 h-4 text-brand-accent" />
                  {t('estimator.area')}
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder={t('estimator.areaPlaceholder')}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                  required
                  min="10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('estimator.condition')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {['needs_work', 'good', 'new'].map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setFormData({...formData, condition})}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                        formData.condition === condition 
                          ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' 
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {condition === 'needs_work' ? t('estimator.needsWork') : condition === 'good' ? t('estimator.good') : t('estimator.new')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-accent text-brand-primary font-bold py-4 rounded-lg hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                {t('estimator.estimateButton')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-center"
          >
            {estimate ? (
              <div className="bg-brand-primary text-white p-8 rounded-2xl shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-xl font-medium mb-2 text-white/80">{t('estimator.estimatedValue')}</h3>
                <div className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                  {formatPrice(estimate.min)} <br/>
                  <span className="text-lg font-normal text-white/60">{t('estimator.to')}</span> <br/>
                  {formatPrice(estimate.max)}
                </div>
                <p className="text-sm text-white/70 mb-8">
                  {t('estimator.disclaimer')}
                </p>
                <button className="w-full bg-brand-accent text-brand-primary font-bold py-3 rounded-lg hover:bg-brand-accent/90 transition-colors">
                  {t('estimator.publishAd')}
                </button>
              </div>
            ) : (
              <div className="bg-muted/50 border border-border p-8 rounded-2xl text-center h-full flex flex-col items-center justify-center">
                <Calculator className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('estimator.emptyTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('estimator.emptySubtitle')}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PriceEstimator;
