export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

export function requireSupabaseEnv() {
  const { url, publishableKey, anonKey } = supabaseEnv;

  if (!url) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  const key = anonKey || publishableKey;
  if (!key) {
    throw new Error(
      "Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY (preferred) or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return { url, publishableKey: key } as const;
}

