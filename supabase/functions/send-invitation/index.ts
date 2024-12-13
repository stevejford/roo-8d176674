import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token, role } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    // Create the user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Update the invitation status
    const { error: inviteError } = await supabase
      .from('invitations')
      .update({ status: 'accepted' })
      .eq('token', token);

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    // Send the invitation email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Restaurant Admin <onboarding@resend.dev>',
        to: [email],
        subject: 'You have been invited to join the restaurant staff',
        html: `
          <h2>Welcome to the team!</h2>
          <p>You have been invited to join as a ${role}.</p>
          <p>Here are your temporary login credentials:</p>
          <p>Email: ${email}</p>
          <p>Password: ${tempPassword}</p>
          <p>Please login and change your password immediately.</p>
          <p><a href="${Deno.env.get('PUBLIC_SITE_URL')}/login">Click here to login</a></p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send invitation email');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});