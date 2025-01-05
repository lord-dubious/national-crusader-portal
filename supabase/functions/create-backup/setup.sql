-- Function to dump table data
CREATE OR REPLACE FUNCTION pg_dump_table_data(table_name text)
RETURNS text AS $$
DECLARE
    result text;
BEGIN
    EXECUTE format('SELECT string_agg(
        format(''INSERT INTO %s (%s) VALUES (%s);'',
            %L,
            string_agg(quote_ident(column_name), '', ''),
            string_agg(
                CASE 
                    WHEN is_nullable = ''YES'' AND column_default IS NULL THEN ''NULL''
                    ELSE format(''%%L'', column_default)
                END,
                '', ''
            )
        ), E''\n'')
    FROM information_schema.columns 
    WHERE table_schema = ''public'' 
    AND table_name = %L', 
    table_name,
    table_name) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;