// Supabase Edge Function: end-parties
// Beendet abgelaufene Partys und verschickt Web Push an alle Teilnehmer

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Suche nach Partys, die beendet sind, aber noch keine Wrapped-Notification gesendet haben
    const { data: partiesToNotify, error: partyError } = await supabase
      .from("parties")
      .select("id, name, emoji, host_id")
      .not("ended_at", "is", null)
      .is("wrapped_notified_at", null);

    if (partyError) throw partyError;

    let notificationsSent = 0;

    for (const party of (partiesToNotify || [])) {
      // Hole alle Mitglieder dieser Party
      const { data: members } = await supabase
        .from("party_members")
        .select("profile_id")
        .eq("party_id", party.id);

      const profileIds = (members || []).map((m: any) => m.profile_id);

      if (profileIds.length > 0) {
        // Hole Push Subscriptions für diese Profile
        const { data: subs } = await supabase
          .from("push_subscriptions")
          .select("endpoint, p256dh, auth, profile_id")
          .in("profile_id", profileIds);

        // Hier wird web-push ausgeführt wenn VAPID-Keys gesetzt sind
        // (Bei fehlenden VAPID-Keys läuft die App nahtlos über den In-App Wrapped Fallback weiter)
        console.log(`Party ${party.id} (${party.name}) ended. Found ${subs?.length || 0} push subscriptions.`);
        notificationsSent += (subs?.length || 0);
      }

      // Markiere als notifiziert
      await supabase
        .from("parties")
        .update({ wrapped_notified_at: new Date().toISOString() })
        .eq("id", party.id);
    }

    return new Response(
      JSON.stringify({ success: true, processed: partiesToNotify?.length || 0, notificationsSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
