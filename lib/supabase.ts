import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Browser client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client (for API routes) — uses service role key
export function createServerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
    { auth: { persistSession: false } }
  );
}

/**
 * Get the authenticated user's profile ID.
 * When Clerk is configured, uses Clerk auth.
 * When Clerk is NOT configured, falls back to the first profile (seed user).
 */
export async function getAuthenticatedProfile(supabaseClient?: ReturnType<typeof createServerClient>) {
  const sb = supabaseClient || createServerClient();

  // Try Clerk auth if keys are configured
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      if (!userId) return null;

      const { data: profile } = await sb
        .from('profiles').select('id').eq('clerk_id', userId).single();
      return profile;
    } catch {
      return null;
    }
  }

  // No Clerk — fall back to first profile (seed user)
  const { data: profile } = await sb
    .from('profiles').select('id').limit(1).single();
  return profile;
}
