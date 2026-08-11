import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const URL = "https://你的项目ID.supabase.co";
const KEY = "你的anon key";

export const supabase = createClient(URL, KEY);