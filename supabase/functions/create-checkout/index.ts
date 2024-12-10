import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, customer_email } = await req.json()

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the stripe key from store_settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('store_settings')
      .select('stripe_secret_key')
      .single();

    if (settingsError) throw settingsError;
    if (!settings?.stripe_secret_key) {
      throw new Error('Stripe is not configured. Please set up your Stripe integration in the admin settings.');
    }

    console.log('Initializing Stripe...');
    const stripe = new Stripe(settings.stripe_secret_key, {
      apiVersion: '2023-10-16',
    })

    console.log('Creating line items...');
    // Create line items for the checkout session
    const lineItems = await Promise.all(items.map(async (item: any) => {
      console.log('Processing item:', item.title);
      // Create a product for each item
      const product = await stripe.products.create({
        name: item.title,
        description: item.description || undefined,
        images: item.image_url ? [item.image_url] : undefined,
      })

      // Create a price for the product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(item.price * 100), // Convert to cents
        currency: 'usd',
      })

      return {
        price: price.id,
        quantity: item.quantity,
      }
    }))

    console.log('Creating checkout session...');
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?payment_status=success`,
      cancel_url: `${req.headers.get('origin')}/?payment_status=cancelled`,
    })

    console.log('Checkout session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})