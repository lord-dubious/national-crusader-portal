import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { createTablesSQL } from "./schema.ts";
import { createFunctionsSQL } from "./functions.ts";
import { createPoliciesSQL } from "./policies.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { dbUrl } = await req.json()
    
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: 'Database URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Connect to the local database
    const client = new Client(dbUrl);
    await client.connect();
    console.log("Connected to local database");

    // Execute the SQL commands in order
    console.log("Creating tables...");
    await client.queryArray(createTablesSQL);
    
    console.log("Creating functions...");
    await client.queryArray(createFunctionsSQL);
    
    console.log("Creating policies...");
    await client.queryArray(createPoliciesSQL);

    await client.end();
    console.log("Database initialization completed successfully");

    return new Response(
      JSON.stringify({ 
        message: 'Database initialized successfully',
        note: 'Remember to create the storage buckets manually in your local Supabase instance'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})