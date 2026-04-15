import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Square } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertiesMapProps {
  properties: any[];
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const { formatPrice } = useApp();

  const validProperties = properties.filter(p => p.lat && p.lng);

  return (
    <div className="h-[70vh] w-full rounded-2xl overflow-hidden border border-border relative z-0">
      <MapContainer 
        center={{ lat: 36.7538, lng: 3.0588 }} // Default to Algiers
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validProperties.map((property) => (
          <Marker key={property.id} position={{ lat: property.lat, lng: property.lng }} icon={customIcon}>
            <Popup className="property-popup">
              <div className="w-48">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-2">
                  <img 
                    src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    property.type === 'sale' 
                      ? 'bg-brand-accent text-brand-primary' 
                      : 'bg-brand-secondary text-brand-white'
                  }`}>
                    {property.type === 'sale' ? 'Vente' : 'Location'}
                  </span>
                  <span className="font-bold text-brand-primary text-sm">
                    {formatPrice(property.price)}
                  </span>
                </div>
                <h3 className="font-bold text-sm line-clamp-1 mb-2">{property.title}</h3>
                
                <div className="flex items-center justify-between text-muted-foreground text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-3 h-3" />
                    <span>{property.area}m²</span>
                  </div>
                </div>

                <Link 
                  to={`/property/${property.id}`}
                  className="block w-full text-center bg-brand-accent text-brand-primary py-1.5 rounded-md text-xs font-bold hover:bg-brand-accent/90 transition-colors"
                >
                  Voir l'annonce
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
