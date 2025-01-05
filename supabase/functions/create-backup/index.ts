import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the current timestamp for the backup file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.sql`;

    // Execute pg_dump using the Supabase service role
    const { data: backupData, error: backupError } = await supabaseClient.rpc('pg_dump', {
      format: 'plain',
      clean: true,
    });

    if (backupError) throw backupError;

    // Upload the backup to the storage bucket
    const { error: uploadError } = await supabaseClient.storage
      .from('db_backups')
      .upload(backupFileName, backupData, {
        contentType: 'application/sql',
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    return new Response(
      JSON.stringify({ message: 'Backup created successfully', fileName: backupFileName }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});