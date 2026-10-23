import { supabase } from './supabase.js';

// Forms are retired. Only an existing authenticated session can open the dashboard.
(async () => {
    const message = document.getElementById('msg');
    if (!supabase) {
        message.textContent = 'Supabase is disconnected. Add your new project URL and publishable key in admin/js/config.js to reconnect.';
        return;
    }
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data?.session) location.href = 'index.html';
        else message.textContent = 'An existing administrator session is required to access the dashboard.';
    } catch {
        message.textContent = 'Unable to verify your administrator session. Please reload to try again.';
    }
})();
