import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.2";
import * as djwt from "https://deno.land/x/djwt@v2.4/mod.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response("unauthenticated", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  const body = await req.json();
  const documentId = body.documentId as string;
  if (!documentId) {
    return new Response("no document", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  const payload = djwt.decode(token.replace("Bearer ", ""))[1];
  const email = (payload as { email: string }).email;

  // TODO: Use app metadata to grant admin rights
  if (
    email !== "emilio.schepis@gmail.com" &&
    email !== "federico.schepis@gmail.com"
  ) {
    return new Response("unauthorized", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 403,
    });
  }

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  await adminClient
    .from("documents")
    .update({ status: "rejected" })
    .match({ id: documentId });

  const { data, error } = await adminClient
    .from("documents")
    .select("*, profile:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn(error);
    return new Response("error", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
