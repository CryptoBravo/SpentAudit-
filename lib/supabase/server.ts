import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireSupabaseEnv } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = requireSupabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

