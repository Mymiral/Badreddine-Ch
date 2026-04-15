import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useAnimation } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { featuredProperties, loading, error } = useProperties();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="section-padding bg-brand-gray-2 dark:bg-brand-black/50" ref={ref}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={itemVariants}
              className="text-3xl md:text-4xl font-display font-bold text-brand-primary dark:text-brand-primary mb-4"
            >
              {t('properties.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 text-lg"
            >
              {t('properties.subtitle')}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={controls}
            variants={itemVariants}
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-brand-accent font-medium hover:text-brand-accent/80 transition-colors group"
            >
              {t('properties.viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
