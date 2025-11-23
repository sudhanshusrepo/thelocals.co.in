import { ProviderProfile } from '../types';

const STORAGE_KEY = 'thelocals_provider_draft';

// This service mocks the Supabase client structure.
// In the future, replace the mocked implementations with:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(URL, KEY)

export const backend = {
  auth: {
    signInWithOtp: async (phone: string): Promise<{ data: any; error: any }> => {
      // Supabase: await supabase.auth.signInWithOtp({ phone })
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { data: { message: "OTP sent" }, error: null };
    },
    verifyOtp: async (phone: string, token: string): Promise<{ data: any; error: any }> => {
      // Supabase: await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (token === '1234') {
        return { data: { session: { access_token: 'mock-jwt-token' } }, error: null };
      }
      return { data: null, error: { message: 'Invalid OTP. Please try 1234.' } };
    }
  },
  
  db: {
    saveDraft: async (profile: ProviderProfile): Promise<void> => {
      // Supabase: await supabase.from('profiles').upsert(profile)
      // Note: We strip File objects for localStorage, but in Supabase you'd upload files first and store URLs.
      try {
        const draft = JSON.stringify(profile, (key, value) => {
          if (key === 'file') return undefined; // Don't save File objects to local storage
          return value;
        });
        localStorage.setItem(STORAGE_KEY, draft);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        console.warn("Failed to save draft locally", e);
      }
    },
    
    getDraft: async (): Promise<ProviderProfile | null> => {
      // Supabase: await supabase.from('profiles').select('*').single()
      try {
        const draft = localStorage.getItem(STORAGE_KEY);
        return draft ? JSON.parse(draft) : null;
      } catch (e) {
        return null;
      }
    },

    submitApplication: async (profile: ProviderProfile): Promise<{ data: any; error: any }> => {
      // Supabase: await supabase.from('applications').insert({ ...profile, status: 'PENDING' })
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.removeItem(STORAGE_KEY);
      return { data: { success: true }, error: null };
    }
  },

  storage: {
    upload: async (file: File, path: string): Promise<{ url: string | null; error: any }> => {
      // Supabase: await supabase.storage.from('documents').upload(path, file)
      // Return public URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For the mock, we use a blob URL. 
      // In production with Supabase, this would return a persistent CDN URL.
      const mockUrl = URL.createObjectURL(file);
      return { url: mockUrl, error: null };
    }
  }
};