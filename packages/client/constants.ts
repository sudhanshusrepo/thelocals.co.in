
import { WorkerCategory } from './types';

// SVG Path Constants for Icons
export const ICONS = {
  SEARCH: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  STAR: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  LOCATION: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
};

// Updated to match the new WorkerCategory enum in types.ts
export const CATEGORY_ICONS: Record<WorkerCategory, string> = {
  [WorkerCategory.Cleaning]: "🧹",
  [WorkerCategory.Plumbing]: "🔧",
  [WorkerCategory.Electrical]: "⚡",
  [WorkerCategory.Handyman]: "🛠️",
  [WorkerCategory.Painting]: "🎨",
  [WorkerCategory.Gardening]: "🌱",
  [WorkerCategory.Moving]: "📦",
  [WorkerCategory.Assembly]: "🔨",
  [WorkerCategory.Tutoring]: "📚",
  [WorkerCategory.PetCare]: "🐾",
  [WorkerCategory.Landscaping]: "🌳",
  [WorkerCategory.HVAC]: "❄️",
  [WorkerCategory.PestControl]: "🦟",
  [WorkerCategory.Security]: "🛡️",
  [WorkerCategory.TechSupport]: "💻",
  [WorkerCategory.Catering]: "🍱",
  [WorkerCategory.Beauty]: "💅",
  [WorkerCategory.Fitness]: "💪",
  [WorkerCategory.Photography]: "📷",
  [WorkerCategory.Videography]: "🎥",
};

type ServiceGroup = {
    name: string;
    color: string;
    icon: string;
    categories: WorkerCategory[];
}

// Updated to use the new WorkerCategory enum and logical groupings
export const SERVICE_GROUPS: Record<string, ServiceGroup> = {
  "Home Services": {
    name: "Home Services",
    icon: "🏠",
    color: "blue",
    categories: [WorkerCategory.Cleaning, WorkerCategory.Plumbing, WorkerCategory.Electrical, WorkerCategory.Handyman, WorkerCategory.Painting, WorkerCategory.PestControl, WorkerCategory.HVAC]
  },
  "Outdoor & Moving": {
    name: "Outdoor & Moving",
    icon: "🌳",
    color: "green",
    categories: [WorkerCategory.Gardening, WorkerCategory.Landscaping, WorkerCategory.Moving, WorkerCategory.Assembly]
  },
  "Lifestyle & Care": {
      name: "Lifestyle & Care",
      icon: "❤️",
      color: "purple",
      categories: [WorkerCategory.PetCare, WorkerCategory.Catering, WorkerCategory.Beauty, WorkerCategory.Fitness]
  },
  "Professional & Tech": {
    name: "Professional & Tech",
    icon: "💼",
    color: "red",
    categories: [WorkerCategory.Tutoring, WorkerCategory.Security, WorkerCategory.TechSupport, WorkerCategory.Photography, WorkerCategory.Videography]
  },
}

// Default start location (if geo fails)
export const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };
