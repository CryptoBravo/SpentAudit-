import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requireSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient | undefined;

/**
 * Browser-only Supabase client using the public anon (publishable) key.
 * Never use service-role keys in the client.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const { url, publishableKey } = requireSupabaseEnv();
  browserClient = createClient(url, publishableKey);
  return browserClient;
}

