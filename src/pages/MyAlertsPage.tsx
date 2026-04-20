import React from 'react';
import MyAlerts from '@/components/MyAlerts';
import BackButton from '@/components/BackButton';

const MyAlertsPage = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <MyAlerts />
      </div>
    </div>
  );
};

export default MyAlertsPage;
