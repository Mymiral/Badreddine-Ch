import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: Search, label: t('nav.properties'), path: '/properties' },
    { icon: PlusSquare, label: t('nav.submitProperty'), path: '/publish' },
    { icon: Heart, label: t('nav.favorites'), path: '/favorites' },
    { icon: User, label: user ? t('nav.profile') : t('auth.login'), path: user ? '/profile' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${
                isActive ? 'text-brand-accent' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-brand-accent/20' : ''}`} />
              <span className="text-[10px] font-medium truncate w-full text-center">
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
