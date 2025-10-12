// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eiljcorgovchnoyyprvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbGpjb3Jnb3ZjaG5veXlwcnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDU1MzAsImV4cCI6MjA3NTQ4MTUzMH0.vu9Mg86HVkUD8EG64f3EN1cc2XR2CXsM6Wz0tOL7i08';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
