import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const encoder = new TextEncoder();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

async function hashVisitor(ip: string, userAgent: string, salt: string): Promise<string> {
  const payload = `${salt}:${ip}:${userAgent}`;
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "method not allowed" }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const salt = Deno.env.get("VIEW_HASH_SALT") ?? "lealindie";

  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: "missing env" }, { status: 500 });
  }

  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const visitorHash = await hashVisitor(ip, userAgent, salt);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc("register_page_view", {
    p_visitor_hash: visitorHash,
    p_path: "/",
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(
    { total_views: data },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
});
