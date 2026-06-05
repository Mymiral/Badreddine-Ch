import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import MyAlerts from '@/components/MyAlerts';
import { LogOut, List, Bell, Heart } from 'lucide-react';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm(t('profile.confirmLogout', 'Voulez-vous vraiment vous déconnecter ?'))) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">{t('nav.profile', 'Profile')}</h1>
        
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-8">
          {user ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-lg mb-2"><strong>Email:</strong> {user.email}</p>
                {user.displayName && <p className="text-lg mb-2"><strong>Nom:</strong> {user.displayName}</p>}
                {user.role && (
                  <p className="text-sm text-muted-foreground capitalize">
                    <strong>Rôle:</strong> {user.role}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                {t('profile.logout', 'Se déconnecter')}
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          )}
        </div>

        {user && (
          <>
            {/* Quick Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <Link 
                to="/my-listings"
                className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-brand-accent hover:shadow-md transition-all group"
              >
                <List className="w-8 h-8 text-brand-accent mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-foreground mb-1">{t('profile.myListings', 'Mes Annonces')}</span>
                <span className="text-xs text-muted-foreground text-center">Gérer les biens publiés</span>
              </Link>

              <Link 
                to="/my-alerts"
                className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-brand-accent hover:shadow-md transition-all group"
              >
                <Bell className="w-8 h-8 text-brand-accent mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-foreground mb-1">{t('profile.myAlerts', 'Mes Alertes')}</span>
                <span className="text-xs text-muted-foreground text-center">Gérer vos alertes e-mail et SMS</span>
              </Link>

              <Link 
                to="/favorites"
                className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-brand-accent hover:shadow-md transition-all group"
              >
                <Heart className="w-8 h-8 text-brand-accent mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg text-foreground mb-1">{t('profile.favorites', 'Favoris')}</span>
                <span className="text-xs text-muted-foreground text-center">Vos biens enregistrés</span>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <MyAlerts />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
