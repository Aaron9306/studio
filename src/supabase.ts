import { createBrowserClient } from '@supabase/ssr';

// Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a browser client for client-side components
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
