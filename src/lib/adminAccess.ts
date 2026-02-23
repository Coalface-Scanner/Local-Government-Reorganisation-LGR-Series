import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;

  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data?.id);
}
