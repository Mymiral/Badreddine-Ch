import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MapPin, BedDouble, Bath, Square, Share2, Heart, Printer, Phone, Mail, CheckCircle2, Calendar, Video, Mic, Wand2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import BackButton from '@/components/BackButton';

import { EvaluationSection } from '@/components/EvaluationSection';
import { CommentsSection } from '@/components/CommentsSection';
import PropertyMap from '@/components/PropertyMap';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { useApp } from '@/contexts/AppContext';
import VirtualStagingModal from '@/components/VirtualStagingModal';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatPrice, currency, setCurrency } = useApp();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agent, setAgent] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [vsModalOpen, setVsModalOpen] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  
  useEffect(() => {
    const fetchAgent = async () => {
      if (!property?.agentId) return;
      try {
        const agentRef = doc(db, 'users', property.agentId);
        const agentSnap = await getDoc(agentRef);
        if (agentSnap.exists()) {
          setAgent({ id: agentSnap.id, ...agentSnap.data() });
        }
      } catch (err) {
        console.error('Error fetching agent:', err);
      }
    };
    if (property) fetchAgent();
  }, [property]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    // Ideally this would sync with Firebase or local storage
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Property not found'}</h2>
          <Link to="/properties" className="text-brand-accent hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600607687931-cecebd808ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom">
        <BackButton />
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                property.type === 'sale' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-secondary text-brand-white'
              }`}>
                {property.type === 'sale' ? t('properties.sale') : t('properties.rent')}
              </span>
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                {property.propertyType}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-primary mb-4">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-brand-accent" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-4">
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-2 mb-1">
                <button 
                  onClick={() => setCurrency('DZD')}
                  className={`text-xs px-2 py-1 rounded font-bold transition-colors ${currency === 'DZD' ? 'bg-brand-accent text-brand-primary' : 'bg-muted text-muted-foreground'}`}
                >
                  DZD
                </button>
                <button 
                  onClick={() => setCurrency('EUR')}
                  className={`text-xs px-2 py-1 rounded font-bold transition-colors ${currency === 'EUR' ? 'bg-brand-accent text-brand-primary' : 'bg-muted text-muted-foreground'}`}
                >
                  EUR
                </button>
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`text-xs px-2 py-1 rounded font-bold transition-colors ${currency === 'USD' ? 'bg-brand-accent text-brand-primary' : 'bg-muted text-muted-foreground'}`}
                >
                  USD
                </button>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-brand-accent">
                {formatPrice(property.price)}
                {property.type === 'rent' && <span className="text-lg text-muted-foreground font-normal"> {t('properties.perMonth')}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="p-2 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleSave} 
                className={`p-2 rounded-full border border-border transition-colors ${isSaved ? 'bg-red-500/10 text-red-500 border-red-200' : 'hover:bg-muted text-muted-foreground'}`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handlePrint} className="p-2 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hidden md:flex">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {property.video && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-brand-accent" /> Vidéo de présentation
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-black">
              <video 
                src={property.video} 
                controls
                className="w-full h-full object-contain"
              ></video>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="md:col-span-3 h-[400px] md:h-[600px] rounded-2xl overflow-hidden relative group">
            <img
              src={images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setVsModalOpen(true)}
              className="absolute bottom-6 right-6 bg-brand-accent text-white px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-accent/90 shadow-lg font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
            >
              <Wand2 className="w-5 h-5" />
              Virtual Staging
            </button>
          </div>
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto h-32 md:h-[600px] pb-2 md:pb-0 hide-scrollbar">
            {images.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-32 md:w-full h-full md:h-32 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === index ? 'border-brand-accent' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Key Features Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <BedDouble className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('properties.beds')}</p>
                  <p className="font-bold text-lg">{property.bedrooms}</p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Bath className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('properties.baths')}</p>
                  <p className="font-bold text-lg">{property.bathrooms}</p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Square className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('properties.area')}</p>
                  <p className="font-bold text-lg">{property.area} m²</p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('propertyDetail.publishedOn')}</p>
                  <p className="font-bold text-lg">
                    {property.createdAt?.toDate ? new Date(property.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">{t('propertyDetail.description')}</h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>{property.description}</p>
              </div>
            </section>

            {/* Features List */}
            {property.features && property.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-6">{t('propertyDetail.features')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Media Additions */}
            {property.audio && (
              <section className="space-y-8 pt-8 border-t border-border">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                    <Mic className="w-6 h-6 text-brand-accent" /> Description vocale
                  </h2>
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                    <audio src={property.audio} controls className="w-full" />
                  </div>
                </div>
              </section>
            )}

            {/* Map */}
            {property.lat && property.lng && (
              <section className="space-y-8 pt-8 border-t border-border">
                <PropertyMap 
                  coordinates={{ lat: property.lat, lng: property.lng }} 
                  title={property.title} 
                  address={`${property.location}, ${property.city}`}
                />
              </section>
            )}

            {/* Evaluations (Rental Only) */}
            {property.type === 'rent' && <EvaluationSection />}

            {/* Comments (All) */}
            <CommentsSection />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Agent Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">{t('propertyDetail.agent')}</h3>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <img
                  src={agent?.photoURL || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"}
                  alt="Agent"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg">{agent?.displayName || agent?.name || 'Agent DarLink'}</h4>
                  <p className="text-muted-foreground text-sm">{agent?.role || 'Conseiller Immobilier'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {agent?.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-brand-accent transition-colors">
                    <Phone className="w-5 h-5" />
                    <span>{agent.phone}</span>
                  </a>
                )}
                <a href={`mailto:${agent?.email || 'contact@darlinkdz.com'}`} className="flex items-center gap-3 text-muted-foreground hover:text-brand-accent transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>{agent?.email || 'contact@darlinkdz.com'}</span>
                </a>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                />
                <input
                  type="tel"
                  placeholder="Votre téléphone"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                />
                <textarea
                  placeholder="Je suis intéressé par ce bien..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-brand-accent text-brand-primary font-bold py-3 rounded-lg hover:bg-brand-accent/90 transition-colors"
                >
                  Envoyer le message
                </button>
                <button
                  type="button"
                  onClick={() => setShowVisitModal(true)}
                  className="w-full bg-transparent border border-brand-accent text-brand-accent font-bold py-3 rounded-lg hover:bg-brand-accent/10 transition-colors mt-2"
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" /> Demander une visite
                </button>
              </form>
            </div>
            
            {/* Mortgage Calculator for Sales */}
            {property.type === 'sale' && (
              <MortgageCalculator propertyPrice={property.price} />
            )}
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Planifier une visite</h3>
            <p className="text-sm text-muted-foreground mb-6">Proposez deux dates et heures qui vous conviennent, l'agent vous confirmera.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date souhaitée 1</label>
                <input type="datetime-local" className="w-full px-4 py-2 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date souhaitée 2</label>
                <input type="datetime-local" className="w-full px-4 py-2 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowVisitModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted font-bold transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  alert("Demande de visite envoyée !");
                  setShowVisitModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-brand-accent text-brand-primary font-bold hover:bg-brand-accent/90 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      
      <VirtualStagingModal 
        isOpen={vsModalOpen} 
        onClose={() => setVsModalOpen(false)} 
        imageUrl={images[activeImage]} 
      />
    </div>
  );
};

export default PropertyDetail;
