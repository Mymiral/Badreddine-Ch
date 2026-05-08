import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';

interface Property {
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

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all properties (limit to 50 for performance)
    const q = query(
      collection(db, 'properties'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const propsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[];
        
        setProperties(propsData);
        setFeaturedProperties(propsData.filter(p => p.featured).slice(0, 6));
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
