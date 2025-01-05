import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

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

    // Create a connection pool to the database
    const pool = new Pool(Deno.env.get('SUPABASE_DB_URL'), 1);
    const connection = await pool.connect();

    try {
      // Execute pg_dump using the raw query
      const { rows } = await connection.queryObject`
        SELECT 
          table_schema || '.' || table_name as table_full_name,
          pg_dump_table_data(table_schema || '.' || table_name) as table_data
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
      `;

      // Combine all table data into a single SQL dump
      const dumpContent = rows
        .map((row) => {
          const { table_full_name, table_data } = row;
          return `-- Table: ${table_full_name}\n${table_data}\n\n`;
        })
        .join('\n');

      // Upload the backup to the storage bucket
      const { error: uploadError } = await supabaseClient.storage
        .from('db_backups')
        .upload(backupFileName, dumpContent, {
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
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Backup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});