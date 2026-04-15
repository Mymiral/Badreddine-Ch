import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useAnimation } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { t } = useTranslation();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative rounded-3xl overflow-hidden bg-brand-black text-white p-12 md:p-20 text-center shadow-2xl"
        >
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-brand-accent/10 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] bg-brand-secondary/20 rounded-full blur-3xl transform -rotate-12"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-brand-accent"
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } },
              }}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              {t('cta.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } },
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                to="/properties"
                className="w-full sm:w-auto bg-brand-accent text-brand-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {t('cta.browseListings')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t('cta.contactAgent')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
