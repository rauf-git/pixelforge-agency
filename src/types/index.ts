export interface Project {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  category: string;
  client?: string;
  description: string;
  tags?: string;
  thumbnail: string; // Filename of the uploaded image
  liveUrl?: string;
}

export interface Testimonial {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  clientName: string;
  roleCompany: string;
  reviewText: string;
  rating: number;
  clientAvatar?: string;
}

export interface Contact {
  id: string;
  created: string;
  name: string;
  email: string;
  message: string;
}

export interface HeroConfig {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  badge: string;
  title1: string;
  title2: string;
  description: string;
  ctaText1?: string;
  ctaText2?: string;
}

export interface ServiceItem {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  order: number;
}
