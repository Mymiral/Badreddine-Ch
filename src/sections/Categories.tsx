import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useAnimation } from 'motion/react';
import { Home, Key, Building2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const { t } = useTranslation();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const categories = [
    {
      id: 'buy',
      icon: <Home className="w-8 h-8" />,
      title: t('categories.buy.title'),
      description: t('categories.buy.description'),
      color: 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary',
      link: '/properties?type=sale',
    },
    {
      id: 'rent',
      icon: <Key className="w-8 h-8" />,
      title: t('categories.rent.title'),
      description: t('categories.rent.description'),
      color: 'bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20 dark:text-brand-accent',
      link: '/properties?type=rent',
    },
    {
      id: 'commercial',
      icon: <Building2 className="w-8 h-8" />,
      title: t('categories.commercial.title'),
      description: t('categories.commercial.description'),
      color: 'bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20 dark:text-brand-secondary',
      link: '/properties?propertyType=office',
    },
    {
      id: 'new',
      icon: <Sparkles className="w-8 h-8" />,
      title: t('categories.new.title'),
      description: t('categories.new.description'),
      color: 'bg-brand-highlight/10 text-brand-highlight dark:bg-brand-highlight/20 dark:text-brand-highlight',
      link: '/properties?featured=true',
    },
  ];

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
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            className="text-3xl md:text-4xl font-display font-bold text-brand-primary dark:text-brand-primary mb-4"
          >
            {t('categories.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            {t('categories.subtitle')}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="bg-brand-secondary text-brand-white rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col">
            {categories.map((category, index) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  to={category.link}
                  className={`group flex items-center justify-between py-8 ${index !== categories.length - 1 ? 'border-b border-brand-white/20' : ''} hover:bg-brand-white/5 px-4 -mx-4 rounded-xl transition-colors`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-brand-white/10 text-brand-accent group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold mb-1 group-hover:text-brand-accent transition-colors">
                        {category.title}
                      </h3>
                      <p className="font-serif italic text-brand-white/80 text-lg">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-10 h-10 rounded-full border border-brand-white/30 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-brand-primary transition-all">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
