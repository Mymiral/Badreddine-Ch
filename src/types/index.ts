export interface Property {
  id: string; // Firebase IDs are string
  title: string;
  location: string;
  address?: string;
  city?: string;
  price: number;
  type: 'sale' | 'rent';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image?: string;
  images?: string[];
  video?: string;
  audio?: string;
  description?: string;
  featured?: boolean;
  lat?: number | null;
  lng?: number | null;
  agentId?: string;
  status?: string;
  createdAt?: any;
}

export interface Category {
  id: number;
  title: string;
  count: string;
  description: string;
  icon: string;
}

export interface Step {
  id: number;
  number: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}
