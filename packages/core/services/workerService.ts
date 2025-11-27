import { supabase } from './supabase';
import { WorkerProfile } from '../types';
import { logger } from './logger';

/**
 * @module workerService
 * @description A service for managing worker data.
 */
export const workerService = {
  /**
   * Retrieves all worker profiles from the database.
   * @returns {Promise<WorkerProfile[]>} A list of all worker profiles.
   * @throws {Error} If the database query fails.
   */
  async getWorkers(): Promise<WorkerProfile[]> {
    const { data, error } = await supabase
      .from('workers')
      .select('*');

    if (error) {
      logger.error("Error fetching workers", { error });
      throw error;
    }

    // Map the flat database structure to the nested WorkerProfile structure
    return data.map((w: any) => ({ ...w, location: { lat: w.location_lat, lng: w.location_lng } }));
  }
};
