import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

/**
 * @module supabase
 * @description Initializes and exports a singleton Supabase client instance.
 */

// Ensure these are set in your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn the developer if the Supabase environment variables are not set.
if (!supabaseUrl || !supabaseAnonKey) {
    logger.warn("Supabase environment variables are missing. Authentication will not work.");
}

/**
 * The singleton Supabase client instance.
 * It is initialized with the Supabase URL and anonymous key from environment variables.
 * If the environment variables are not set, it falls back to placeholder values to prevent the application from crashing,
 * although functionality will be broken.
 */
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder',
    {
        global: {
            headers: {
                'Accept': 'application/json',
            }
        }
    }
);
