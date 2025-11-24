
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdnltvvxiychrsdzenia.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkbmx0dnZ4aXljaHJzZHplbmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjM2NzIsImV4cCI6MjA3OTM5OTY3Mn0.LKYscrC9N4320dv0KimqqS83WKHJXQgN5Hyinw2Rua8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTable() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from profiles table:', error);
    return;
  }

  console.log('Profiles table schema:', data);
}

inspectTable();
