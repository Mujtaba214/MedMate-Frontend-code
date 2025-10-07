import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dtjtxlpmxyoavrrsspfj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0anR4bHBteHlvYXZycnNzcGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4Mjk3NjMsImV4cCI6MjA3NTQwNTc2M30.km_-VLb0C07ob3yiyIqHVgoWAGTijKkDrdQsY453x2w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
