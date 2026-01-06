import { supabase } from './supabase';

export async function updateSiteTimestamp() {
  const { error } = await supabase
    .from('site_metadata')
    .update({
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (error) {
    // Silently fail - timestamp update is not critical
  }
}
