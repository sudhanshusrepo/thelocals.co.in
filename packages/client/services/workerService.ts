
import { supabase } from './supabase';
import { WorkerProfile, WorkerCategory, WorkerStatus } from '../types';

// The new select query joins the 'profiles' table to get the avatar_url
// and selects columns that actually exist in your schema.
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

// This function transforms the raw database response into the frontend's WorkerProfile type.
const transformWorker = (worker: any): WorkerProfile => ({
  id: worker.id,
  name: worker.name,
  category: worker.category,
  description: worker.description,
  price: worker.price_per_hour, // Map from database column
  priceUnit: 'hr', // Hardcode as per the new schema
  rating: worker.rating,
  status: worker.status || 'OFFLINE',
  // Use a default avatar and handle the nested profile structure from Supabase
  imageUrl: worker.profile?.avatar_url || `https://i.pravatar.cc/150?u=${worker.id}`,
  expertise: worker.expertise || [],
  // Default these fields as they don't exist in the database
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

  // This function is updated to only map fields that exist in the database
  async updateWorkerProfile(workerId: string, updates: Partial<WorkerProfile>) {
    if (!workerId || !updates) {
        throw new Error("workerId and updates are required.");
    }
      
    const dbPayload: any = {};
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.price !== undefined) dbPayload.price_per_hour = updates.price; // Map to correct DB column
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
