import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Lock, User } from 'lucide-react';
import Logo from '@/components/Logo';

const Welcome = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  useEffect(() => {
    // If user already visited, redirect to home
    const hasVisited = localStorage.getItem('hasVisitedWelcome');
    if (hasVisited) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    // Set RTL direction if needed
    document.documentElement.dir = ['ar', 'tzm'].includes(lang) ? 'rtl' : 'ltr';
  };

  const handleEntry = (path: string) => {
    if (!selectedLang) return;
    setIsExiting(true);
    localStorage.setItem('hasVisitedWelcome', 'true');
    setTimeout(() => {
      navigate(path, { replace: true });
    }, 500); // Wait for fade out
  };

  const skipWelcome = () => {
    setIsExiting(true);
    localStorage.setItem('hasVisitedWelcome', 'true');
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 500);
  };

  const getTagline = () => {
    switch (i18n.language) {
      case 'ar': return "بوابتك العقارية الأولى في الجزائر";
      case 'en': return "Your number one real estate portal in Algeria";
      case 'tzm': return "Tawwurt-ik tamezwarut n ukabar n tɣawsiwin di Lezzayer";
      case 'fr':
      default: return "Votre premier portail immobilier en Algérie";
    }
  };

  const getTitle = () => {
    if (!selectedLang) return "Choose your language / اختر لغتك";
    switch (i18n.language) {
      case 'ar': return "اختر لغتك";
      case 'en': return "Choose your language";
      case 'tzm': return "Fren tutlayt-ik";
      case 'fr':
      default: return "Choisissez votre langue";
    }
  };

  const getEntryTitle = () => {
    switch (i18n.language) {
      case 'ar': return "كيف تريد الدخول؟";
      case 'en': return "How do you want to enter?";
      case 'tzm': return "Amek tebɣiḍ ad tkecmeḍ?";
      case 'fr':
      default: return "Comment voulez-vous entrer ?";
    }
  };

  const getSpectatorText = () => {
    switch (i18n.language) {
      case 'ar': return { title: "مشاهد", desc: "تصفح الإعلانات بحرية", btn: "دخول" };
      case 'en': return { title: "Spectator", desc: "Browse listings freely", btn: "Enter" };
      case 'tzm': return { title: "Amsikkel", desc: "Wali ixxamen s tlelli", btn: "Kcem" };
      case 'fr':
      default: return { title: "Spectateur", desc: "Parcourez les annonces librement", btn: "Entrer" };
    }
  };

  const getAdminText = () => {
    switch (i18n.language) {
      case 'ar': return { title: "مسؤول", desc: "إدارة الإعلانات والمحتوى", btn: "تسجيل الدخول" };
      case 'en': return { title: "Administrator", desc: "Manage listings and content", btn: "Login" };
      case 'tzm': return { title: "Amseddas", desc: "Ssefrek ixxamen d wawal", btn: "Kcem" };
      case 'fr':
      default: return { title: "Administrateur", desc: "Gérez les annonces et le contenu", btn: "Se connecter" };
    }
  };

  const spectator = getSpectatorText();
  const admin = getAdminText();

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 py-10">
            {/* 1 - Animated Logo Entrance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 }
              }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-6 animate-[float_3s_ease-in-out_infinite]">
                <Logo className="w-[280px] md:w-[380px]" />
              </div>
              <p className="text-xl text-gray-300 font-medium">
                {getTagline()}
              </p>
            </motion.div>

            {/* 2 - Language Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-lg mb-12"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-white">{getTitle()}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
                  { code: 'fr', label: 'Français', flag: '🇫🇷' },
                  { code: 'en', label: 'English', flag: '🇬🇧' },
                  { code: 'tzm', label: 'Tamazight', flag: 'ⵣ' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedLang === lang.code
                        ? 'border-brand-accent bg-brand-accent/10 text-white'
                        : 'border-white/10 bg-white/5 hover:border-brand-accent/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-lg">{lang.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 3 - Entry Mode Selection */}
            <AnimatePresence>
              {selectedLang && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-3xl"
                >
                  <h2 className="text-2xl font-bold text-center mb-6 text-white">{getEntryTitle()}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Spectator Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center hover:border-brand-accent/50 transition-colors">
                      <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mb-6">
                        <User className="w-8 h-8 text-brand-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{spectator.title}</h3>
                      <p className="text-gray-400 mb-8 flex-grow">{spectator.desc}</p>
                      <button
                        onClick={() => handleEntry('/')}
                        className="w-full py-4 bg-brand-accent text-white font-bold rounded-xl hover:bg-brand-accent/90 transition-colors"
                      >
                        {spectator.btn}
                      </button>
                    </div>

                    {/* Admin Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center hover:border-brand-accent/50 transition-colors">
                      <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-brand-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{admin.title}</h3>
                      <p className="text-gray-400 mb-8 flex-grow">{admin.desc}</p>
                      <button
                        onClick={() => handleEntry('/login')}
                        className="w-full py-4 bg-transparent border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        {admin.btn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip Link */}
            <button
              onClick={skipWelcome}
              className="absolute bottom-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;
