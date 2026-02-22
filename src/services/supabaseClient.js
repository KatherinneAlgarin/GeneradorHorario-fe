import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lzhiigioekpaaehiuasv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aGlpZ2lvZWtwYWFlaGl1YXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDAxNTcsImV4cCI6MjA4NjUxNjE1N30.iElIyToJXqYpX6yd9X9Ddtks_ZqmetEorfngo5qTs0M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);