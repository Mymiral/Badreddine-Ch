import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useAnimation } from 'motion/react';
import { Search, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const { t } = useTranslation();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const steps = [
    {
      id: 'search',
      icon: <Search className="w-8 h-8" />,
      title: t('howItWorks.steps.search.title'),
      description: t('howItWorks.steps.search.description'),
      color: 'text-brand-primary',
    },
    {
      id: 'visit',
      icon: <Calendar className="w-8 h-8" />,
      title: t('howItWorks.steps.visit.title'),
      description: t('howItWorks.steps.visit.description'),
      color: 'text-brand-accent',
    },
    {
      id: 'finalize',
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: t('howItWorks.steps.finalize.title'),
      description: t('howItWorks.steps.finalize.description'),
      color: 'text-brand-secondary',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="section-padding bg-brand-gray-2 dark:bg-brand-black/50" ref={ref}>
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            className="text-3xl md:text-4xl font-display font-bold text-brand-accent dark:text-brand-accent mb-4"
          >
            {t('howItWorks.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            {t('howItWorks.subtitle')}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative"
        >
          {steps.map((step, index) => (
            <motion.div key={step.id} variants={itemVariants} className="relative z-10 text-left border-b border-border pb-12 md:pb-0 md:border-b-0 md:border-r md:last:border-r-0 md:pr-8">
              <div className="absolute -top-12 -left-4 font-serif font-black text-[120px] leading-[0.8] text-muted/30 z-0 select-none">
                0{index + 1}
              </div>
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm ${step.color} bg-white dark:bg-card border border-border relative group`}>
                  <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-primary dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
            {t('howItWorks.needHelp')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-primary text-brand-white dark:bg-brand-accent dark:text-brand-primary px-8 py-4 rounded-lg font-medium hover:bg-brand-secondary hover:text-brand-white dark:hover:bg-brand-highlight dark:hover:text-brand-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t('howItWorks.contactUs')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
