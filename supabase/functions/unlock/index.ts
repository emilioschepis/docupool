import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.33.2";
import * as djwt from "https://deno.land/x/djwt@v2.4/mod.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
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
  const userId = (payload as { sub: string }).sub;

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const {
    data: { coins },
    error: userError,
  } = await adminClient
    .from("user_coins")
    .select("coins")
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.warn(userError);
    return new Response("error", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (coins < 1) {
    return new Response("no coins", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  const { data: existing, error: existingError } = await adminClient
    .from("document_unlocks")
    .select("user_id")
    .eq("user_id", userId)
    .eq("document_id", documentId)
    .maybeSingle();

  if (existingError) {
    console.warn(userError);
    return new Response("error", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (existing) {
    return new Response("already unlocked", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  await adminClient
    .from("user_coins")
    .update({ coins: coins - 1 })
    .eq("user_id", userId)
    .single();

  const { error } = await adminClient.from("document_unlocks").insert({
    document_id: documentId,
    user_id: userId,
  });

  if (error) {
    console.warn(error);
    return new Response("error", {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response("ok", {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
