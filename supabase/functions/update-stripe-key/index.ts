import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Unauthorized');
    }

    // Verify user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      console.error('Authorization error:', profileError);
      throw new Error('Unauthorized - Admin access required');
    }

    const { stripeKey } = await req.json();

    if (!stripeKey) {
      throw new Error('Stripe key is required');
    }

    // Test if the key starts with 'sk_'
    if (!stripeKey.startsWith('sk_')) {
      throw new Error('Invalid Stripe secret key format');
    }

    // First, get the existing store settings record or create one if it doesn't exist
    const { data: existingSettings, error: fetchError } = await supabaseClient
      .from('store_settings')
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Failed to fetch store settings:', fetchError);
      throw new Error('Failed to fetch store settings');
    }

    let updateResult;
    if (existingSettings) {
      // Update existing record
      updateResult = await supabaseClient
        .from('store_settings')
        .update({ stripe_secret_key: stripeKey })
        .eq('id', existingSettings.id);
    } else {
      // Create new record with default values
      updateResult = await supabaseClient
        .from('store_settings')
        .insert({
          store_name: 'Default Store Name',
          address: 'Default Address',
          stripe_secret_key: stripeKey
        });
    }

    if (updateResult.error) {
      console.error('Failed to update config:', updateResult.error);
      throw new Error('Failed to update Stripe key');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});