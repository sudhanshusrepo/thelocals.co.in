import { supabase } from './supabase';

export const databaseService = {
  async createCustomersTable() {
    const {
      data,
      error
    } = await supabase.rpc('run_sql', {
      sql: `
          CREATE TABLE customers (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            full_name TEXT,
            email TEXT UNIQUE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
    });

    if (error) console.error('Error creating customers table:', error);
    return data;
  },

  async setupRLS() {
    const {
      data,
      error
    } = await supabase.rpc('run_sql', {
      sql: `
          -- 1. Enable RLS on the customers table
          ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

          -- 2. Create a policy that allows users to read their own customer data
          CREATE POLICY "Allow individual read access" ON public.customers
          FOR SELECT USING (auth.uid() = id);

          -- 3. Create a policy that allows users to create their own customer data
          CREATE POLICY "Allow individual insert access" ON public.customers
          FOR INSERT WITH CHECK (auth.uid() = id);

          -- 4. Create a policy that allows users to update their own customer data
          CREATE POLICY "Allow individual update access" ON public.customers
          FOR UPDATE USING (auth.uid() = id);
        `
    });

    if (error) console.error('Error setting up RLS:', error);
    return data;
  }
};