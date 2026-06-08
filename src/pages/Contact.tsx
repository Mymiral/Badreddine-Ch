import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom">
        <BackButton />
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 text-brand-primary"
          >
            {t('nav.contact')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {t('contact.subtitle', 'Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre projet immobilier.')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">{t('contact.info', 'Informations de contact')}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t('contact.address', 'Adresse')}</h4>
                    <p className="text-muted-foreground">Ain Temouchent, Ain Temouchent</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t('contact.phone', 'Téléphone')}</h4>
                    <p className="text-muted-foreground">06 66 74 61 65</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{t('contact.email', 'Email')}</h4>
                    <p className="text-muted-foreground">contact@darlinkdz.com<br />support@darlinkdz.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-bold mb-4">{t('contact.hours', 'Heures d\'ouverture')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>{t('contact.days1', 'Dimanche - Jeudi')}</span>
                    <span>09:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{t('contact.days2', 'Samedi')}</span>
                    <span>10:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between text-brand-accent font-medium">
                    <span>{t('contact.days3', 'Vendredi')}</span>
                    <span>{t('contact.closed', 'Fermé')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">{t('contact.sendMessage', 'Envoyez-nous un message')}</h3>

              {success && (
                <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <p>{t('contact.success', 'Votre message a été envoyé avec succès. Notre équipe vous contactera dans les plus brefs délais.')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.fullName', 'Nom complet')} *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                      placeholder={t('name_placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.email', 'Email')} *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                      placeholder={t('email_placeholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.phone', 'Téléphone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                      placeholder={t('phone_placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.subject', 'Sujet')} *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                    >
                      <option value="">{t('contact.selectSubject', 'Sélectionnez un sujet')}</option>
                      <option value="buy">{t('contact.buyProperty', 'Acheter un bien')}</option>
                      <option value="rent">{t('contact.rentProperty', 'Louer un bien')}</option>
                      <option value="sell">{t('contact.sellProperty', 'Vendre un bien')}</option>
                      <option value="support">{t('contact.techSupport', 'Support technique')}</option>
                      <option value="other">{t('contact.other', 'Autre demande')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('contact.message', 'Message')} *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all resize-none"
                    placeholder={t('message_placeholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-brand-accent text-brand-primary font-bold rounded-lg hover:bg-brand-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.send', 'Envoyer le message')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
