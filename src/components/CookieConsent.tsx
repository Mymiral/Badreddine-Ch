import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X } from 'lucide-react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('darlinkdz_cookie_consent');
    if (!consent) {
      // Small delay to not overwhelm the user immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('darlinkdz_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('darlinkdz_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pb-safe"
        >
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0 mt-1">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Respect de votre vie privée</h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Nous utilisons des cookies pour améliorer votre expérience sur DarLinkDz, analyser notre trafic et vous proposer des annonces immobilières pertinentes. En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.
                </p>
                <a href="#" className="text-sm text-brand-accent hover:underline mt-2 inline-block font-medium">
                  Lire notre politique de confidentialité (RGPD)
                </a>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
              <button 
                onClick={handleReject}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Refuser
              </button>
              <button 
                onClick={handleAccept}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-accent text-brand-primary text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Accepter tout
              </button>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
