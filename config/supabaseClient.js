import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const db = createClient(
  "https://wzbzemlfdayxqrtbsyav.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQzNTQzOCwiZXhwIjoxOTM5MDExNDM4fQ.0rZI_HniTmIgEdOgql8RwhglYyhJGqFYV2sXDzt6ti0"
);
