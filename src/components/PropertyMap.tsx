import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in Leaflet with React
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = customIcon;

interface PropertyMapProps {
  coordinates: { lat: number; lng: number } | [number, number];
  title: string;
  address?: string;
}

export default function PropertyMap({ coordinates, title, address }: PropertyMapProps) {
  const position: [number, number] = Array.isArray(coordinates) 
    ? coordinates 
    : [coordinates.lat, coordinates.lng];

  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border relative z-0">
        <MapContainer 
          center={position} 
          zoom={15} 
          scrollWheelZoom={true} 
          dragging={true}
          zoomControl={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
      </div>
      {address && (
        <p className="text-muted-foreground font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {address}
        </p>
      )}
    </div>
  );
}
