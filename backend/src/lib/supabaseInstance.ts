import { createClient } from "@supabase/supabase-js";

export const supabaseInstance = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET!,
);
