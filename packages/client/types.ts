
export enum WorkerCategory {
    Cleaning = 'Cleaning',
    Plumbing = 'Plumbing',
    Electrical = 'Electrical',
    Handyman = 'Handyman',
    Painting = 'Painting',
    Gardening = 'Gardening',
    Moving = 'Moving',
    Assembly = 'Assembly',
    Tutoring = 'Tutoring',
    PetCare = 'PetCare',
    Landscaping = 'Landscaping',
    HVAC = 'HVAC',
    PestControl = 'PestControl',
    Security = 'Security',
    TechSupport = 'TechSupport',
    Catering = 'Catering',
    Beauty = 'Beauty',
    Fitness = 'Fitness',
    Photography = 'Photography',
    Videography = 'Videography'
}

export type WorkerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface WorkerProfile {
  id: string;
  name: string;
  category: WorkerCategory;
  rating: number;
  reviewCount: number; // Note: This field is not in the database and will be defaulted.
  price: number; // Mapped from price_per_hour
  priceUnit: 'hr'; // Hardcoded to 'hr' as per the new schema
  expertise: string[];
  description: string;
  imageUrl: string; // from profiles.avatar_url
  location: {
    lat: number;
    lng: number;
  };
  isVerified: boolean; // Note: This field is not in the database and will be defaulted.
  status: WorkerStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  worker_id: string;
  worker?: WorkerProfile; // Joined data
  status: BookingStatus;
  note: string;
  total_price: number;
  payment_status?: 'pending' | 'paid';
  date: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  worker_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SearchIntent {
  category: WorkerCategory | null;
  keywords: string[];
  sortBy: 'rating' | 'price' | 'distance' | 'relevance';
  urgency: 'high' | 'normal';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}
