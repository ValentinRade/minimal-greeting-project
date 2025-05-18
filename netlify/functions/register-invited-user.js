
// Netlify function for securely registering invited users with proper permissions
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Set CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }) 
    };
  }
  
  try {
    const body = JSON.parse(event.body);
    const { userId, invitationId, companyId, role, invitedBy, invitedAt } = body;
    
    if (!userId || !invitationId || !companyId || !role) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required parameters' })
      };
    }
    
    console.log(`Processing invitation for user ${userId} to company ${companyId} with role ${role}`);
    
    // Initialize Supabase client with service role key for admin privileges
    // These environment variables must be set in your Netlify deployment settings
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Failed to create company user association',
          error: companyUserError
        })
      };
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Failed to update invitation status',
          error: invitationError
        })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Registration completed successfully' })
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Server error during registration process', error: error.message })
    };
  }
};
