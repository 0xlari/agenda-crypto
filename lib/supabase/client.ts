import { createClient } from "@supabase/supabase-js";

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase browser environment is not configured.");
  }

  return createClient(supabaseUrl, publishableKey);
}

export function getSupabaseBrowser() {
  return createSupabaseBrowserClient();
}

export const supabase = new Proxy(
  {},
  {
    get(_target, property) {
      const client = createSupabaseBrowserClient();
      const value = Reflect.get(client, property);

      return typeof value === "function" ? value.bind(client) : value;
    },
  }
) as ReturnType<typeof createSupabaseBrowserClient>;
