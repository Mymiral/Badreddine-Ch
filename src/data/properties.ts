export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image?: string;
  images?: string[];
  video?: string;
  audio?: string;
  featured: boolean;
  type: string;
  transactionType?: 'buy' | 'rent' | 'sell';
  coordinates: { lat: number; lng: number } | [number, number];
  description: string;
  status?: 'available' | 'sold';
  uid?: string;
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Villa Méditerranée',
    price: '2,500,000 €',
    location: 'Saint-Tropez, France',
    beds: 5,
    baths: 4,
    sqft: 450,
    image: 'https://picsum.photos/seed/villa1/800/600',
    featured: true,
    type: 'villa',
    coordinates: [43.2727, 6.6391],
    description: 'Une villa d\'exception avec vue mer imprenable.'
  },
  {
    id: '3',
    title: 'Modern Oasis',
    price: '1,850,000 €',
    location: 'Marrakech, Morocco',
    beds: 6,
    baths: 6,
    sqft: 800,
    image: 'https://picsum.photos/seed/villa2/800/600',
    featured: true,
    type: 'villa',
    coordinates: [31.6295, -7.9811],
    description: 'Un havre de paix au cœur de la Palmeraie.'
  },
  {
    id: '4',
    title: 'Villa à Chéraga',
    price: '1,200,000 €',
    location: 'Chéraga, Alger',
    beds: 4,
    baths: 3,
    sqft: 350,
    images: [
      'https://picsum.photos/seed/cheraga1/800/600',
      'https://picsum.photos/seed/cheraga2/800/600',
      'https://picsum.photos/seed/cheraga3/800/600',
      'https://picsum.photos/seed/cheraga4/800/600',
      'https://picsum.photos/seed/cheraga5/800/600',
      'https://picsum.photos/seed/cheraga6/800/600',
      'https://picsum.photos/seed/cheraga7/800/600',
      'https://picsum.photos/seed/cheraga8/800/600',
      'https://picsum.photos/seed/cheraga9/800/600',
      'https://picsum.photos/seed/cheraga10/800/600'
    ],
    featured: true,
    type: 'villa',
    coordinates: [36.7671, 2.9597],
    description: 'Villa luxueuse avec jardin et piscine.'
  },
  {
    id: '5',
    title: 'Appartement F4 Fordlo',
    price: '1,200,000,000 DZD',
    location: 'Fordlo, Alger',
    beds: 4,
    baths: 1,
    sqft: 116,
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    featured: true,
    type: 'apartment',
    coordinates: [36.7525, 3.0420],
    description: 'Appartement F4, 2 façades, 2ème étage. Proche transports, écoles et mosquées.'
  },
  {
    id: '6',
    title: 'Villa Hydra',
    price: '950,000,000 DZD',
    location: 'Hydra, Alger',
    beds: 5,
    baths: 1,
    sqft: 180,
    video: 'https://www.w3schools.com/html/movie.mp4',
    featured: true,
    type: 'villa',
    coordinates: [36.7431, 3.0333],
    description: 'Villa d\'exception à Hydra, 2 façades.'
  },
  {
    id: '7',
    title: 'Villa Cité Sahraoui',
    price: '1,500,000,000 DZD',
    location: 'Cité Sahraoui, Blida',
    beds: 5,
    baths: 1,
    sqft: 150,
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    featured: true,
    type: 'villa',
    coordinates: [36.4701, 2.8288],
    description: 'Villa à proximité d\'école primaire, rue principale et nationale.'
  }
];
