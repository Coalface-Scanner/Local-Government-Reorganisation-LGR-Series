import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

function getCorsHeaders(req: Request) {
  const allowedOrigin = Deno.env.get('INTERNAL_ADMIN_ALLOWED_ORIGIN') || '';
  const origin = req.headers.get('origin') || '';
  const effectiveOrigin = allowedOrigin && origin === allowedOrigin ? origin : allowedOrigin;

  return {
    "Access-Control-Allow-Origin": effectiveOrigin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Internal-Admin-Token",
  };
}

function isAuthorized(req: Request): boolean {
  const featureEnabled = Deno.env.get('ENABLE_ADMIN_RECOVERY_FUNCTIONS') === 'true';
  const requiredToken = Deno.env.get('INTERNAL_ADMIN_TOKEN') || '';
  const providedToken = req.headers.get('X-Internal-Admin-Token') || '';
  return featureEnabled && !!requiredToken && providedToken === requiredToken;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: 'Endpoint disabled or unauthorized' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const email = (body?.email || '').toString().trim().toLowerCase();
    const password = (body?.password || '').toString();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'email and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = usersData.users.find((u) => (u.email || '').toLowerCase() === email);

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password, email_confirm: true });
      if (updateError) throw updateError;
    } else {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createError) throw createError;
      if (!created.user?.id) throw new Error('User creation failed');
      userId = created.user.id;
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!adminRow) {
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({ user_id: userId, email, created_by: userId });
      if (insertError) throw insertError;
    }

    await supabase.from('cms_audit_log').insert({
      table_name: 'admin_users',
      action: 'RECOVERY_CREATE_OR_UPDATE_ADMIN',
      user_id: userId,
      user_email: email,
      changes: { source: 'edge-function' },
    });

    return new Response(JSON.stringify({ success: true, email }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
