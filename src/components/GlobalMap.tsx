import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Property } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Star, MapPin, Bed, Bath, Maximize, Navigation, Crosshair } from 'lucide-react';
import { Button } from './ui/button';

// Fix for default marker icon in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center updates
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export default function GlobalMap() {
  const { language } = useApp();
  const { t } = useTranslation();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(props);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'properties');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const locateUser = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  const algeriaCenter: [number, number] = [36.7538, 3.0588]; // Centered on Algiers for better initial view

  const labels = {
    fr: { 
      title: 'Carte Interactive', 
      subtitle: 'Explorez les biens à travers l\'Algérie',
      locate: 'Ma position',
      directions: 'Itinéraire',
      userPos: 'Vous êtes ici'
    },
    en: { 
      title: 'Interactive Map', 
      subtitle: 'Explore properties across Algeria',
      locate: 'My location',
      directions: 'Directions',
      userPos: 'You are here'
    },
    ar: { 
      title: 'خريطة تفاعلية', 
      subtitle: 'استكشف العقارات في جميع أنحاء الجزائر',
      locate: 'موقعي',
      directions: 'الاتجاهات',
      userPos: 'أنت هنا'
    }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 h-[70vh] flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">{l.title}</h1>
          <p className="text-muted-foreground">{l.subtitle}</p>
        </div>

        <div className="flex-grow rounded-3xl overflow-hidden border border-border shadow-2xl relative z-10">
          <MapContainer 
            center={algeriaCenter} 
            zoom={6} 
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController center={mapCenter} />

            {userLocation && (
              <Marker position={userLocation} icon={UserIcon}>
                <Popup>{l.userPos}</Popup>
              </Marker>
            )}

            {properties.map((property) => (
              <Marker 
                key={property.id} 
                position={[
                  property.lat ?? property.coordinates?.lat ?? 36.7, 
                  property.lng ?? property.coordinates?.lng ?? 3.0
                ]}
              >
                <Popup className="property-popup">
                  <div className="w-64 p-2">
                    <img 
                      src={property.image || 'https://picsum.photos/seed/realestate/400/300'} 
                      alt={property.title} 
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm leading-tight">{property.title}</h3>
                        <span className="text-primary font-bold text-xs">{property.price}</span>
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location}
                      </div>
                      <div className="grid grid-cols-3 gap-1 py-2 border-y border-border">
                        <div className="flex flex-col items-center">
                          <Bed className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px]">{property.bedrooms}</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-border">
                          <Bath className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px]">{property.bathrooms}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Maximize className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px]">{property.area}m²</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 text-[10px] h-8 btn-luxury"
                          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                        >
                          Voir détails
                        </Button>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${property.lat ?? property.coordinates?.lat ?? 36.7},${property.lng ?? property.coordinates?.lng ?? 3.0}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                          title={l.directions}
                        >
                          <Navigation className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button 
            onClick={locateUser}
            className="absolute bottom-6 right-6 z-[1000] w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-xl text-primary hover:text-primary/80 transition-all hover:scale-110"
            title={l.locate}
          >
            <Crosshair className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
