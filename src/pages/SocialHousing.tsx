import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Building2, CheckCircle2, XCircle, Info, ArrowRight, Search } from 'lucide-react';
import BackButton from '@/components/BackButton';

const SocialHousing = () => {
  const { t } = useTranslation();
  const [income, setIncome] = useState('');
  const [familySize, setFamilySize] = useState('1');
  const [wilaya, setWilaya] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = Number(income);
    
    let result = {
      aadl: false,
      lpa: false,
      lsp: false,
      message: ''
    };

    // Mock logic based on general Algerian social housing rules
    if (incomeNum >= 24000 && incomeNum <= 108000) {
      result.aadl = true;
      result.lpa = true;
      result.message = t('social.messages.aadlLpa');
    } else if (incomeNum > 108000 && incomeNum <= 540000) {
      result.lpa = true;
      result.message = t('social.messages.lpa');
    } else if (incomeNum < 24000) {
      result.message = t('social.messages.lpl');
    } else {
      result.message = t('social.messages.none');
    }

    setEligibilityResult(result);
  };

  const programs = [
    {
      id: 'aadl',
      name: 'AADL (Location-Vente)',
      status: 'Fermé (Attente AADL 3)',
      income: '24,000 - 108,000 DZD',
      description: 'Programme de location-vente destiné à la classe moyenne. Paiement échelonné sur 25 ans.',
      link: 'https://www.aadl.com.dz'
    },
    {
      id: 'lpa',
      name: 'LPA (Logement Promotionnel Aidé)',
      status: 'Ouvert selon wilaya',
      income: '24,000 - 540,000 DZD',
      description: 'Logement neuf avec aide financière de l\'État (CNL) et crédit bancaire bonifié.',
      link: '#'
    },
    {
      id: 'lpl',
      name: 'LPL (Logement Public Locatif)',
      status: 'Ouvert',
      income: '< 24,000 DZD',
      description: 'Logement social destiné aux ménages à très faible revenu. Loyer symbolique.',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom">
        <BackButton />
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-brand-primary">
            {t('social.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('social.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Eligibility Checker */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-brand-accent" />
                {t('social.checkEligibility')}
              </h2>
              
              <form onSubmit={checkEligibility} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('social.monthlyIncome')}</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Ex: 60000"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('social.familySize')}</label>
                  <select 
                    value={familySize}
                    onChange={(e) => setFamilySize(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent appearance-none"
                  >
                    <option value="1">{t('social.single')}</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t('social.wilaya')}</label>
                  <select 
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent appearance-none"
                    required
                  >
                    <option value="">{t('social.select')}</option>
                    <option value="16">Alger</option>
                    <option value="31">Oran</option>
                    <option value="25">Constantine</option>
                    <option value="09">Blida</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-accent text-brand-primary dark:bg-brand-accent dark:text-brand-primary py-3 rounded-lg font-bold mt-4 hover:opacity-90 transition-opacity"
                >
                  {t('social.verify')}
                </button>
              </form>

              {eligibilityResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg border ${
                    eligibilityResult.aadl || eligibilityResult.lpa 
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                      : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                  }`}
                >
                  <p className="text-sm font-medium">{eligibilityResult.message}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Programs List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('social.availablePrograms')}</h2>
            
            {programs.map((program) => (
              <div key={program.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{program.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${
                        program.status.includes('Ouvert') 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {program.status.includes('Ouvert') ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                        {program.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <p className="text-sm text-muted-foreground">{t('social.requiredIncome')}</p>
                    <p className="font-bold">{program.income}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {program.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={program.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:underline"
                  >
                    {t('social.officialSite')} <ArrowRight className="w-4 h-4" />
                  </a>
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:underline">
                    {t('social.viewListings')} (0)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialHousing;
