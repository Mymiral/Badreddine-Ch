import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, Globe, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const siteLogo = localStorage.getItem('siteLogo') || '/logo.jpg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.properties'), path: '/properties' },
    { name: t('nav.social'), path: '/social-housing' },
    { name: t('nav.estimate'), path: '/estimator' },
    { name: t('nav.agents'), path: '/agents' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D2B]/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-[#0D0D2B] py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          {!logoError ? (
            <img 
              src={siteLogo} 
              alt="DarLinkDZ Logo" 
              className="h-[32px] md:h-[40px] w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="font-display font-bold text-xl md:text-2xl tracking-tight flex items-center">
              <span className="text-white">Dar</span>
              <span style={{ color: '#00F5C4' }}>Link</span>
              <span style={{ color: '#7B2FBE' }}>DZ</span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-sm font-medium transition-colors hover:text-brand-accent py-2 group ${
                location.pathname === link.path
                  ? 'text-brand-accent'
                  : 'text-white/80'
              }`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-full transition-all duration-300 ${
                location.pathname === link.path ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
              } origin-left`}></span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors flex items-center gap-1"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-medium uppercase">{i18n.language}</span>
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  {['fr', 'en', 'ar', 'tzm'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLang(lang)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        i18n.language === lang ? 'bg-muted/50 font-medium' : ''
                      }`}
                    >
                      {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Tamazight'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Auth / Publish */}
          <div className="flex items-center gap-3 ml-2">
            <Link
              to="/publish"
              className="group flex items-center gap-2 bg-brand-accent text-brand-primary px-4 py-2 rounded-lg font-bold hover:bg-brand-accent/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)]"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span className="hidden lg:inline">{t('nav.submitProperty', 'Publier')}</span>
            </Link>

            {user ? (
              <Link to="/profile" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 overflow-hidden transform hover:scale-105 group">
                <User className="w-5 h-5 group-hover:text-brand-accent transition-colors" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-white hover:text-brand-accent transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
              >
                <User className="w-4 h-4" />
                <span className="hidden xl:inline">{t('auth.login', 'Connexion')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D2B] border-b border-white/10 overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium py-2 border-b border-white/10 text-white"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  {['fr', 'en', 'ar', 'tzm'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLang(lang)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        i18n.language === lang ? 'bg-brand-accent text-brand-primary' : 'bg-white/10 text-white'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full bg-white/10 text-white"
                >
                  {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              
              {user ? (
                <div className="flex flex-col gap-2 pt-4">
                  <Link
                    to="/publish"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-brand-accent text-brand-primary px-4 py-3 rounded-lg font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    {t('nav.submitProperty')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-center py-2 text-white/70 hover:text-white"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-primary px-4 py-3 rounded-lg font-medium mt-4"
                >
                  <User className="w-5 h-5" />
                  {t('auth.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
