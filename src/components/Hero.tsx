import { useApp } from '@/contexts/AppContext';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Phone } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Hero() {
  const { language } = useApp();

  const labels = {
    fr: {
      title: "Votre chemin vers le",
      titleAccent: "bien immobilier idéal",
      subtitle: "Découvrez les meilleures propriétés en Algérie avec Darlink DZ",
      more: "En savoir plus",
      call: "Appeler"
    },
    en: {
      title: "Your path to the",
      titleAccent: "ideal real estate",
      subtitle: "Discover the best properties in Algeria with Darlink DZ",
      more: "Learn more",
      call: "Call"
    },
    ar: {
      title: "طريقك نحو",
      titleAccent: "العقار المثالي",
      subtitle: "اكتشف أفضل العقارات في الجزائر مع Darlink DZ",
      more: "تعرف أكثر",
      call: "اتصل"
    }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-40 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="w-64 h-48 mx-auto flex items-center justify-center p-4">
            <Logo className="w-full h-full" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
            <span className="text-white">{l.title}</span><br />
            <span className="text-primary">{l.titleAccent}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light">
            {l.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto mb-32">
            <button 
              onClick={() => {
                document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:flex-1 btn-outline-luxury py-4 text-lg"
            >
              {l.more}
            </button>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }));
              }}
              className="w-full sm:flex-1 btn-luxury py-4 flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="h-5 w-5" />
              {l.call}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
