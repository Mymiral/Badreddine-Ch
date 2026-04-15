import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Star, Award, Home } from 'lucide-react';
import BackButton from '@/components/BackButton';

const Agents = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Mock agents data
  const agents = [
    {
      id: 1,
      name: 'Amine Benali',
      role: 'Agent Immobilier Senior',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      location: 'Alger Centre',
      experience: 8,
      properties: 45,
      rating: 4.9,
      phone: '+213 555 123 456',
      email: 'amine@darlinkdz.com'
    },
    {
      id: 2,
      name: 'Sarah Mansouri',
      role: 'Spécialiste Location',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      location: 'Oran',
      experience: 5,
      properties: 32,
      rating: 4.8,
      phone: '+213 555 987 654',
      email: 'sarah@darlinkdz.com'
    },
    {
      id: 3,
      name: 'Karim Haddad',
      role: 'Expert Commercial',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      location: 'Constantine',
      experience: 12,
      properties: 78,
      rating: 5.0,
      phone: '+213 555 456 789',
      email: 'karim@darlinkdz.com'
    },
    {
      id: 4,
      name: 'Leila Bouzid',
      role: 'Consultante Immobilier',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      location: 'Annaba',
      experience: 4,
      properties: 21,
      rating: 4.7,
      phone: '+213 555 321 654',
      email: 'leila@darlinkdz.com'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

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
            {t('agents.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {t('agents.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative p-4 flex justify-center">
                <div className="w-48 h-64 rounded-full overflow-hidden relative shadow-md">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="p-6 pt-2 text-center">
                <h3 className="text-2xl font-serif font-bold mb-1">{agent.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-brand-primary">{agent.rating}</span>
                </div>
                <p className="text-brand-accent text-sm font-medium mb-4">{agent.role}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    <span>{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-brand-accent" />
                    <span>{agent.experience} {t('agents.experience')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Home className="w-4 h-4 text-brand-accent" />
                    <span>{agent.properties} {t('agents.properties')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-brand-accent hover:text-brand-primary text-foreground py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-brand-secondary hover:text-brand-white text-foreground py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agents;
