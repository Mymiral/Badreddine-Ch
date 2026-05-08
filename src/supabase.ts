import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Supabase functionality may be limited.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * SUPABASE SQL SCHEMA:
 * 
 * create table properties (
 *   id uuid default uuid_generate_v4() primary key,
 *   title text not null,
 *   type text check (type in ('sale', 'rent')),
 *   property_type text,
 *   price numeric,
 *   location text,
 *   address text,
 *   city text,
 *   bedrooms integer,
 *   bathrooms integer,
 *   area numeric,
 *   images text[],
 *   image text,
 *   video text,
 *   audio text,
 *   description text,
 *   featured boolean default false,
 *   lat numeric,
 *   lng numeric,
 *   agent_id text,
 *   status text default 'available',
 *   created_at timestamp with time zone default now()
 * );
 * 
 * create table alerts (
 *   id uuid default uuid_generate_v4() primary key,
 *   uid text,
 *   type text,
 *   location text,
 *   budget text,
 *   email text,
 *   phone text,
 *   channels text[],
 *   active boolean default true,
 *   created_at timestamp with time zone default now()
 * );
 */
