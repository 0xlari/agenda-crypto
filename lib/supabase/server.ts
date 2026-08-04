import { createClient } from "@supabase/supabase-js";

function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server environment is not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export function getSupabaseServer() {
  return createSupabaseServerClient();
}

export const supabaseServer = new Proxy(
  {},
  {
    get(_target, property) {
      const client = createSupabaseServerClient();
      const value = Reflect.get(client, property);

      return typeof value === "function" ? value.bind(client) : value;
    },
  }
) as ReturnType<typeof createSupabaseServerClient>;
