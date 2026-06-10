export interface Rsvp {
  id: string;
  fullName: string;
  status: 'yes' | 'no';
  guestCount: number;
  menuPreference: 'classic' | 'chicken' | 'vegetarian' | 'child';
  attendingWedding?: 'agri' | 'osmaniye' | 'both';
  note?: string;
  createdAt: string;
}

export interface GuestMessage {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface ProgramEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'journey' | 'engagement' | 'portraits';
}
