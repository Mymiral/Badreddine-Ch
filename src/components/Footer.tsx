import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { language } = useApp();

  const labels = {
    fr: {
      desc: "L'excellence immobilière au service de vos rêves les plus prestigieux en Algérie. Une expertise reconnue dans le luxe.",
      nav: "Navigation",
      services: "Services",
      contact: "Contact",
      rights: "Tous droits réservés.",
      links: {
        home: "Accueil",
        buy: "Acheter",
        sell: "Vendre",
        about: "À Propos",
        estimate: "Estimation",
        legal: "Mentions Légales",
        privacy: "Confidentialité"
      }
    },
    en: {
      desc: "Real estate excellence serving your most prestigious dreams in Algeria. Recognized expertise in luxury.",
      nav: "Navigation",
      services: "Services",
      contact: "Contact",
      rights: "All rights reserved.",
      links: {
        home: "Home",
        buy: "Buy",
        sell: "Sell",
        about: "About",
        estimate: "Estimation",
        legal: "Legal Mentions",
        privacy: "Privacy"
      }
    },
    ar: {
      desc: "التميز العقاري في خدمة أحلامك الأكثر رقيًا في الجزائر. خبرة معترف بها في العقارات الفاخرة.",
      nav: "الملاحة",
      services: "الخدمات",
      contact: "اتصل بنا",
      rights: "جميع الحقوق محفوظة.",
      links: {
        home: "الرئيسية",
        buy: "شراء",
        sell: "بيع",
        about: "حول",
        estimate: "تقييم",
        legal: "إشعارات قانونية",
        privacy: "الخصوصية"
      }
    }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <footer className="bg-background border-t border-border py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="text-2xl font-display font-bold text-primary tracking-tighter">
              DarLink<span className="text-white">DZ</span>
            </div>
            <p className="text-white/60 leading-relaxed text-sm">
              {l.desc}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">{l.nav}</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.home}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.buy}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.sell}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.about}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">{l.services}</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.estimate}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.legal}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{l.links.privacy}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">{l.contact}</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span>Alger, Algérie</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>+213 555 55 55 55</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span>contact@darlinkdz.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-white/40">
          © 2026 DarLinkDZ. {l.rights}
        </div>
      </div>
    </footer>
  );
}
