import React from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import MyAlerts from '@/components/MyAlerts';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">{t('nav.profile', 'Profile')}</h1>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-8">
          {user ? (
            <div>
              <p className="text-lg mb-4"><strong>Email:</strong> {user.email}</p>
              {/* Add more profile details here */}
            </div>
          ) : (
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          )}
        </div>

        {user && (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <MyAlerts />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
