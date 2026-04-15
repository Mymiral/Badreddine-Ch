import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  if (typeof window !== 'undefined' && window.history.length <= 1) return null;
  
  return (
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-muted-foreground hover:text-brand-accent transition-all duration-200 mb-6"
    >
      <ArrowLeft size={20} />
      <span className="text-sm">{t('common.back', 'Back')}</span>
    </button>
  );
};

export default BackButton;
