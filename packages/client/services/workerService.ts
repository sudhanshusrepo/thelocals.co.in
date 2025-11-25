
import { supabase } from './supabase';
import { WorkerProfile, WorkerCategory, WorkerStatus } from '../types';

// The select query remains the same
const selectQuery = `
    id, 
    name, 
    category, 
    description, 
    price_per_hour,
    rating,
    status,
    expertise,
    location_lat,
    location_lng,
    profile:profiles ( avatar_url )
`;

/**
 * Converts a category string from the database (e.g., 'house_cleaning', 'doctor_nurse') 
 * to the corresponding frontend WorkerCategory enum value (e.g., 'House Cleaning', 'Doctor/Nurse').
 * This is the definitive fix for the category filtering issue, handling underscores, slashes, and ampersands.
 * @param dbCategory The raw category string from the database.
 * @returns The matching WorkerCategory enum value, or WorkerCategory.OTHER if no match is found.
 */
const toWorkerCategory = (dbCategory: string): WorkerCategory => {
    // Create a dynamic map from a "cleaned" string to the enum value for robust matching.
    const categoryMap: { [key: string]: WorkerCategory } = {};
    for (const key in WorkerCategory) {
        const enumValue = WorkerCategory[key as keyof typeof WorkerCategory];
        // Normalize the enum value to match the expected DB format:
        // 1. Lowercase
        // 2. Replace '/' and '&' with spaces
        // 3. Replace multiple spaces with a single space
        const cleanedValue = enumValue
            .toLowerCase()
            .replace(/\/|&/g, ' ') 
            .replace(/\s+/g, ' ');
        categoryMap[cleanedValue] = enumValue;
    }

    // Clean the database category string in the same way
    const cleanedDbCategory = dbCategory
        .toLowerCase()
        .replace(/_/g, ' ');

    // Find the matching enum value in our map
    const matchedCategory = Object.keys(categoryMap).find(key => key === cleanedDbCategory);
    
    if (matchedCategory) {
        return categoryMap[matchedCategory];
    }

    console.warn(`Unmatched category from DB: "${dbCategory}". Defaulting to "Other".`);
    return WorkerCategory.OTHER;
};


// This function transforms the raw database response into the frontend's WorkerProfile type.
const transformWorker = (worker: any): WorkerProfile => ({
  id: worker.id,
  name: worker.name,
  // *** DEFINITIVE FIX ****
  // Use the robust mapping function to ensure the category from the DB is correctly
  // translated into the frontend enum, resolving the filtering mismatch permanently.
  category: toWorkerCategory(worker.category),
  description: worker.description,
  price: worker.price_per_hour, // Map from database column
  priceUnit: 'hr', // Hardcode as per the new schema
  rating: worker.rating,
  status: worker.status || 'OFFLINE',
  imageUrl: worker.profile?.avatar_url || `https://i.pravatar.cc/150?u=${worker.id}`,
  expertise: worker.expertise || [],
  reviewCount: 0, 
  isVerified: false,
  location: {
    lat: worker.location_lat,
    lng: worker.location_lng,
  },
});

export const workerService = {
  async getWorkers(): Promise<WorkerProfile[]> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select(selectQuery);

      if (error) {
        console.error("Error fetching workers from DB:", error.message);
        throw error;
      }

      return data.map(transformWorker);
    } catch (e) {
      console.error("Worker service error", e);
      return [];
    }
  },

  async getWorkerById(id: string): Promise<WorkerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select(selectQuery)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
            console.log(`Worker with id ${id} not found.`);
            return null;
        }
        console.error(`Error fetching worker with id ${id} from DB:`, error.message);
        throw error;
      }
      
      return data ? transformWorker(data) : null;
    } catch (e) {
      console.error("Worker service error", e);
      return null;
    }
  },

  async updateWorkerStatus(workerId: string, status: WorkerStatus) {
    if (!workerId || !status) {
        throw new Error("workerId and status are required.");
    }

    try {
        const { error } = await supabase
            .from('workers')
            .update({ status })
            .eq('id', workerId);
        
        if (error) throw error;
    } catch (e) {
        console.error("Failed to update status in DB:", e);
        throw e;
    }
  },

  async updateWorkerProfile(workerId: string, updates: Partial<WorkerProfile>) {
    if (!workerId || !updates) {
        throw new Error("workerId and updates are required.");
    }
      
    const dbPayload: any = {};
    if (updates.name !== undefined) dbPayload.name = updates.name;
    // When updating, convert the frontend category back to the database format
    if (updates.category !== undefined) {
         dbPayload.category = updates.category.toLowerCase().replace(/\s+|\//g, '_').replace(/&/g, 'and');
    }
    if (updates.price !== undefined) dbPayload.price_per_hour = updates.price;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.location !== undefined) {
        dbPayload.location_lat = updates.location.lat;
        dbPayload.location_lng = updates.location.lng;
    }
    if (updates.expertise !== undefined) dbPayload.expertise = updates.expertise;

    try {
        const { error } = await supabase
            .from('workers')
            .update(dbPayload)
            .eq('id', workerId);

        if (error) throw error;
    } catch (e) {
         console.error("Failed to update profile in DB:", e);
         throw e;
    }
  }
};
