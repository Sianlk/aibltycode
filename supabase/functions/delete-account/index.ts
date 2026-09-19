import { buildCorsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = userData.user;

    // Stop future billing before deleting the app account. Stripe may retain
    // legally required transaction records independently of the app account.
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (stripeKey && user.email) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
      const customers = await stripe.customers.list({ email: user.email, limit: 10 });
      for (const customer of customers.data) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "all",
          limit: 100,
        });
        for (const subscription of subscriptions.data) {
          if (subscription.status !== "canceled") {
            await stripe.subscriptions.cancel(subscription.id);
          }
        }
      }
    }

    // Preserve other players' battle records while removing this user's identity.
    for (const column of ["host_id", "opponent_id", "winner_id"]) {
      const { error } = await admin.from("battle_rooms").update({ [column]: null }).eq(column, user.id);
      if (error) throw error;
    }

    const deleteByUserId = [
      "battle_spectators",
      "battle_stats",
      "challenge_progress",
      "subscriptions",
      "user_avatar_items",
      "user_badges",
      "user_progress",
      "user_roles",
    ];

    for (const table of deleteByUserId) {
      const { error } = await admin.from(table).delete().eq("user_id", user.id);
      if (error) throw error;
    }

    const { error: profileError } = await admin.from("profiles").delete().eq("id", user.id);
    if (profileError) throw profileError;

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, false);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ deleted: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Account deletion failed";
    console.error("delete-account:", message);
    return new Response(JSON.stringify({ error: "Account deletion failed. Contact privacy@sianlk.com if this persists." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
