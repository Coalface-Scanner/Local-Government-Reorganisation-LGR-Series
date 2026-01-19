import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const adminEmail = 'Rowan@coalfaceebgagement.co.uk';
    const temporaryPassword = 'Admin2025!LGR';

    const { data: existingUser, error: _checkError } = await supabase.auth.admin.listUsers();

    if (existingUser?.users.some(u => u.email === adminEmail)) {
      const existingAuthUser = existingUser.users.find(u => u.email === adminEmail);

      if (existingAuthUser) {
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', existingAuthUser.id)
          .maybeSingle();

        if (!adminCheck) {
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              user_id: existingAuthUser.id,
              email: adminEmail,
              created_by: existingAuthUser.id
            });

          if (adminError) {
            throw new Error(`Failed to add existing user to admin_users: ${adminError.message}`);
          }

          return new Response(
            JSON.stringify({
              message: 'Existing user added to admin_users table',
              email: adminEmail,
              note: 'User now has admin access'
            }),
            {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          message: 'Admin user already exists',
          email: adminEmail,
          note: 'If you need to reset the password, use the Supabase dashboard'
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: authData, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        created_by: 'setup-function'
      }
    });

    if (error) {
      throw error;
    }

    if (!authData?.user) {
      throw new Error('User creation succeeded but no user data returned');
    }

    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        email: adminEmail,
        created_by: authData.user.id
      });

    if (adminError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to add user to admin_users: ${adminError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin user created successfully',
        email: adminEmail,
        temporaryPassword: temporaryPassword,
        note: 'Please change this password immediately after first login'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to create admin user'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});