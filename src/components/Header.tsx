import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Globe, Menu, X, Home, Plus, Map as MapIcon, LogIn, LogOut, User, LayoutGrid, Sun, Moon, Coins } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/supabase';
import { useTranslation } from 'react-i18next';
import CreatePropertyModal from './CreatePropertyModal';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/Logo';

export default function Header() {
  const { language, setLanguage, currency, setCurrency } = useApp();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return !document.documentElement.classList.contains('light');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenPublish = () => setShowCreateModal(true);
    window.addEventListener('open-publish-modal', handleOpenPublish);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('open-publish-modal', handleOpenPublish);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ] as const;

  const currencies = [
    { code: 'DZD', label: 'DZD (Dinar)' },
    { code: 'EUR', label: 'EUR (€)' }
  ] as const;

  const labels = {
    fr: { publish: 'Publier', map: 'Carte', login: 'Connexion', logout: 'Déconnexion', myListings: 'Mes Annonces' },
    en: { publish: 'Publish', map: 'Map', login: 'Login', logout: 'Logout', myListings: 'My Listings' },
    ar: { publish: 'نشر', map: 'خريطة', login: 'دخول', logout: 'خروج', myListings: 'إعلاناتي' }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  const menuItems = [
    { label: 'Accueil', action: 'home' },
    { label: 'Acheter', action: 'buy' },
    { label: 'Louer', action: 'rent' },
    { label: 'Vendre', action: 'sell' },
    { label: 'Mes alertes', action: 'alerts' },
    { label: 'À propos', action: 'about' },
    { label: 'Contact', action: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
        >
          <Logo className="h-8 md:h-10 w-auto" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors ${
                        language === lang.code ? 'text-primary bg-muted' : 'text-foreground/80'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={currencyMenuRef}>
            <button 
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 font-medium text-sm"
            >
              {currency}
            </button>
            
            <AnimatePresence>
              {isCurrencyMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as 'DZD' | 'EUR');
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors ${
                        currency === curr.code ? 'text-primary bg-muted' : 'text-foreground/80'
                      }`}
                    >
                      <span className="text-sm font-medium">{curr.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white shadow-lg shadow-primary/20"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-16 bg-background z-40 p-6 flex flex-col space-y-6 overflow-y-auto"
          >
            {menuItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => { 
                  window.dispatchEvent(new CustomEvent('navigate', { detail: item.action })); 
                  setIsMenuOpen(false); 
                }} 
                className="text-xl font-medium text-foreground/90 hover:text-primary transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-6 border-t border-border space-y-4">
              {user ? (
                <>
                  <button 
                    onClick={() => { setShowCreateModal(true); setIsMenuOpen(false); }}
                    className="w-full btn-luxury py-4 rounded-xl font-bold flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" /> {l.publish}
                  </button>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left py-4 text-red-500 font-medium flex items-center">
                    <LogOut className="h-5 w-5 mr-2" /> {l.logout}
                  </button>
                </>
              ) : (
                <button onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }} className="w-full text-left py-4 text-foreground font-medium flex items-center">
                  <LogIn className="h-5 w-5 mr-2" /> {l.login}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && <CreatePropertyModal onClose={() => setShowCreateModal(false)} />}
      </AnimatePresence>
    </header>
  );
}
