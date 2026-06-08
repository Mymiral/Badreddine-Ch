import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-black text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <Logo className="h-[40px] w-auto" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61588943084188&mibextid=wwXIfr&rdid=N1pvBUp48IMKgwDD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18EdNpEWSi%2F%3Fmibextid%3DwwXIfr#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/darlink_dz" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a target="_blank" href="https://www.tiktok.com/@darlink_dz?_r=1&_t=ZS-971Lwuu62a5" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <title>tiktok</title>
                  <path fill="#fff" d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">{t('footer.navigation')}</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-accent transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-400 hover:text-brand-accent transition-colors text-sm">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-gray-400 hover:text-brand-accent transition-colors text-sm">
                  {t('nav.agents')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-brand-accent transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">{t('footer.support')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Ain Temouchent, Ain Temouchent</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-gray-400 text-sm">06 66 74 61 65</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-gray-400 text-sm">contact@darlinkdz.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-white">{t('footer.newsletter.title')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletter.subtitle')}
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-brand-accent text-brand-primary font-medium px-4 py-3 rounded-lg hover:bg-brand-accent/90 transition-colors text-sm"
              >
                {t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">
              {t('footer.termsOfService')}
            </Link>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
