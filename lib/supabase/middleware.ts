import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { requireSupabaseEnv } from "./env";

export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = requireSupabaseEnv();

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({
          request: { headers: request.headers },
        });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Refresh session if expired (also verifies JWT with Supabase Auth).
  await supabase.auth.getUser();

  return response;
}

