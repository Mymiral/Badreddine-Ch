export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: 'Vente' | 'Location';
  beds?: number;
  baths?: number;
  area: number;
  image: string;
  featured?: boolean;
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
