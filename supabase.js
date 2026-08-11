import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const URL = "https://hfwfohoyuhmtmirrjye.supabase.co";
const KEY = "sb_publishable_nOodkqB5mk2KHSbBv9t19Q_7C-MmDjz";

export const supabase = createClient(URL, KEY);
