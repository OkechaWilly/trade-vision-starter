import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project values
const supabaseUrl = "https://nlgqvkqmbkaigbdqontv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZ3F2a3FtYmthaWdiZHFvbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzE2MDgsImV4cCI6MjA2Nzg0NzYwOH0.ZLwqc2zox-y-H2oxzbtqr6kc17QUwrIdiHW0VMNgNGQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
