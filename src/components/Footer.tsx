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
              <a href="https://www.instagram.com/darlink_dz" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588943084188&mibextid=wwXIfr&rdid=N1pvBUp48IMKgwDD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18EdNpEWSi%2F%3Fmibextid%3DwwXIfr#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a target="_blank" href="https://www.tiktok.com/@darlink_dz?_r=1&_t=ZS-971Lwuu62a5" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <title>tiktok</title>
                  <path fill="#fff" d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
                </svg>
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
                <span>06 66 74 61 65</span>
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
