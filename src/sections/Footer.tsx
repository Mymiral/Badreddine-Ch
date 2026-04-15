import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const [logoError, setLogoError] = useState(false);
  const siteLogo = localStorage.getItem('siteLogo') || '/logo.jpg';

  return (
    <footer className="bg-brand-black text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              {!logoError ? (
                <img 
                  src={siteLogo} 
                  alt="DarLinkDZ Logo" 
                  className="h-[40px] w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="font-display font-bold text-2xl tracking-tight flex items-center">
                  <span className="text-white">Dar</span>
                  <span style={{ color: '#00F5C4' }}>Link</span>
                  <span style={{ color: '#7B2FBE' }}>DZ</span>
                </div>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-colors">
                <Linkedin className="w-5 h-5" />
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
                <span className="text-gray-400 text-sm">123 Rue Didouche Mourad, Alger Centre, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-accent shrink-0" />
                <span className="text-gray-400 text-sm">+213 (0) 555 123 456</span>
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
