
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RequestBody {
  userId: string;
  invitationId: string;
  companyId: string;
  role: string;
  invitedBy: string;
  invitedAt: string | null;
}

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json() as RequestBody;
    const { userId, invitationId, companyId, role, invitedBy, invitedAt } = body;

    if (!userId || !invitationId || !companyId || !role) {
      return new Response(
        JSON.stringify({ message: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing invitation for user ${userId} to company ${companyId} with role ${role}`);

    // Initialize Supabase client with service role key (from environment)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create a company_users entry (with admin privileges that bypass RLS)
    const { error: companyUserError } = await supabaseAdmin
      .from('company_users')
      .insert({
        company_id: companyId,
        user_id: userId,
        role: role,
        invited_by: invitedBy,
        invited_at: invitedAt,
        accepted_at: new Date().toISOString()
      });

    if (companyUserError) {
      console.error("Company user creation error:", companyUserError);
      return new Response(
        JSON.stringify({
          message: 'Failed to create company user association',
          error: companyUserError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update the invitation as accepted
    const { error: invitationError } = await supabaseAdmin
      .from('company_invitations')
      .update({
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitationId);

    if (invitationError) {
      console.error("Invitation update error:", invitationError);
      return new Response(
        JSON.stringify({
          message: 'Failed to update invitation status',
          error: invitationError
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Registration completed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ message: 'Server error during registration process', error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
