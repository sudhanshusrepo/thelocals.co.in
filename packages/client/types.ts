
export enum WorkerCategory {
  PLUMBER = 'Plumber',
  ELECTRICIAN = 'Electrician',
  MAID = 'Maid',
  MECHANIC = 'Mechanic',
  CARPENTER = 'Carpenter',
  PAINTER = 'Painter',
  AC_REPAIR = 'AC Repair',
  GARDENER = 'Gardener',
  TEACHER = 'Tutor',
  TRAINER = 'Personal Trainer',
  DRIVER = 'Driver',
  CAR_WASHING = 'Car Washing',
  DOCTOR_NURSE = 'Doctor/Nurse',
  TIFFIN_SERVICE = 'Tiffin Service',
  ERRAND_RUNNER = 'Errand Runner',
  HOUSE_CLEANING = 'House Cleaning',
  LAUNDRY_SERVICE = 'Laundry Service',
  PEST_CONTROL = 'Pest Control',
  APPLIANCE_REPAIR = 'Appliance Repair',
  LOCKSMITH = 'Locksmith',
  BIKE_REPAIR = 'Bike Repair',
  ROADSIDE_ASSISTANCE = 'Roadside Assistance',
  BEAUTICIAN = 'Beautician',
  BABYSITTER = 'Babysitter',
  PET_SITTER = 'Pet Sitter',
  COOK = 'Cook',
  PACKERS_AND_MOVERS = 'Packers and Movers',
  DOCUMENTATION_ASSISTANCE = 'Documentation Assistance',
  OTHER = 'Other'
}

export type WorkerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface WorkerProfile {
  id: string;
  name: string;
  category: WorkerCategory;
  rating: number;
  reviewCount: number;
  price: number; // Base price or hourly rate
  priceUnit: 'hr' | 'visit' | 'service';
  experienceYears: number;
  expertise: string[];
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  isVerified: boolean;
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
