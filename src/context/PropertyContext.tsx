import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/supabase';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  city?: string;
  type: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  video?: string;
  audio?: string;
  featured: boolean;
  createdAt: any;
  agentId: string;
  lat?: number | null;
  lng?: number | null;
}

interface PropertyContextType {
  properties: Property[];
  featuredProperties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const mapSupaProperty = (p: any): Property => ({
  id: p.id,
  title: p.title,
  description: p.description || '',
  price: Number(p.price),
  location: p.location,
  address: p.address || '',
  city: p.city || '',
  type: p.type,
  propertyType: p.property_type || p.propertyType || '',
  bedrooms: Number(p.bedrooms || 0),
  bathrooms: Number(p.bathrooms || 0),
  area: Number(p.area || 0),
  images: p.images || [],
  video: p.video || '',
  audio: p.audio || '',
  featured: !!p.featured,
  createdAt: p.created_at,
  agentId: p.agent_id || p.agentId || '',
  lat: p.lat ? Number(p.lat) : null,
  lng: p.lng ? Number(p.lng) : null,
});

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (err) throw err;

      const mapped = (data || []).map(mapSupaProperty);
      setProperties(mapped);
      setFeaturedProperties(mapped.filter(p => p.featured).slice(0, 6));
      setError(null);
    } catch (err: any) {
      console.error('Error fetching properties from Supabase:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Listen to custom reload events
    const reloadListener = () => {
      fetchProperties();
    };
    window.addEventListener('property-created', reloadListener);
    window.addEventListener('property-updated', reloadListener);
    window.addEventListener('reload-properties', reloadListener);

    return () => {
      window.removeEventListener('property-created', reloadListener);
      window.removeEventListener('property-updated', reloadListener);
      window.removeEventListener('reload-properties', reloadListener);
    };
  }, []);

  return (
    <PropertyContext.Provider value={{ properties, featuredProperties, loading, error }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
