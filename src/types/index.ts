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
