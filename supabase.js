import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const URL = "https://hfwfohoyuhmtmirrjye.supabase.co";  // ← 从API页面直接复制
const KEY = "sb_publishable_nOodkqB5mk2KHSbBv9t19Q_7C-MmDjz";  // ← 从API页面直接复制

export const supabase = createClient(URL, KEY);
