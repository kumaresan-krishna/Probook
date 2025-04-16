import { createClient } from '@supabase/supabase-js';

// Using the actual Supabase URL and anon key
const supabaseUrl = 'https://fjtekqcpvnmblhxeddwt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdGVrcWNwdm5tYmxoeGVkZHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjIwMDcsImV4cCI6MjA2MDM5ODAwN30.RX1foHwcZlaXg8crNXm5x-FgGBPJ1G1gwZeCuyCMT3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 