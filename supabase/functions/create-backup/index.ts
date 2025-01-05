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
      // Get list of tables
      const { rows: tables } = await connection.queryObject`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
      `;

      // Initialize backup content
      let dumpContent = '-- Database backup\n\n';

      // For each table, get its schema and data
      for (const table of tables) {
        const tableName = table.table_name;
        console.log('Processing table:', tableName);

        // Get table schema
        const { rows: columns } = await connection.queryObject`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = ${tableName}
          ORDER BY ordinal_position;
        `;

        // Get table data
        const { rows: data } = await connection.queryObject`
          SELECT * FROM ${tableName};
        `;

        dumpContent += `-- Table: ${tableName}\n`;
        
        // Create table schema
        let createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
        columns.forEach((col: any, index: number) => {
          createTable += `  ${col.column_name} ${col.data_type}`;
          if (col.column_default) {
            createTable += ` DEFAULT ${col.column_default}`;
          }
          if (col.is_nullable === 'NO') {
            createTable += ' NOT NULL';
          }
          createTable += index < columns.length - 1 ? ',\n' : '\n';
        });
        createTable += ');\n\n';
        dumpContent += createTable;

        // Insert data
        if (data.length > 0) {
          const columnNames = Object.keys(data[0]).join(', ');
          data.forEach((row: any) => {
            const values = Object.values(row).map(value => 
              value === null ? 'NULL' : 
              typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : 
              value
            ).join(', ');
            dumpContent += `INSERT INTO ${tableName} (${columnNames}) VALUES (${values});\n`;
          });
          dumpContent += '\n';
        }
      }

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