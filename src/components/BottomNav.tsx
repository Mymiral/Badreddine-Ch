import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: t('nav.home', 'Accueil'), path: '/' },
    { icon: Search, label: t('nav.properties', 'Recherche'), path: '/properties' },
    { icon: PlusSquare, label: t('nav.submitProperty', 'Publier'), path: '/publish' },
    { icon: User, label: user ? t('nav.profile', 'Profil') : t('auth.login', 'Connexion'), path: user ? '/profile' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe pt-2 px-2 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center justify-around overflow-hidden pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full py-1 group"
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-accent/10 text-brand-accent scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                }`}
              >
                <item.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'fill-brand-accent/20 stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-brand-accent shadow-[0_0_8px_var(--brand-accent)]" />
                )}
              </div>
              <span 
                className={`text-[10px] sm:text-[11px] font-semibold mt-1.5 tracking-wide transition-all ${
                  isActive ? 'text-brand-accent' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
