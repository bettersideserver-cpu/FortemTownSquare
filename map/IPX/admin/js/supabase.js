import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

// Do not load the SDK or restore an old session until a project is configured.
export const supabase = SUPABASE_URL.trim() && SUPABASE_PUBLISHABLE_KEY.trim()
    ? (await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.111.0/+esm'))
        .createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;
