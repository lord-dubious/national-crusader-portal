import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pdfPath } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the PDF file
    const { data: pdfData, error: downloadError } = await supabase
      .storage
      .from('pdf_newspapers')
      .download(pdfPath)

    if (downloadError) {
      throw new Error('Failed to download PDF')
    }

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(await pdfData.arrayBuffer())
    
    // Get the first page
    const pages = pdfDoc.getPages()
    if (pages.length === 0) {
      throw new Error('PDF has no pages')
    }
    
    const firstPage = pages[0]
    
    // Create a new PDF with just the first page
    const thumbnailDoc = await PDFDocument.create()
    const [copiedPage] = await thumbnailDoc.copyPages(pdfDoc, [0])
    thumbnailDoc.addPage(copiedPage)

    // Save the single page as PDF
    const thumbnailBytes = await thumbnailDoc.save()

    // Generate thumbnail filename
    const thumbnailPath = `thumbnails/${pdfPath.replace(/\.[^/.]+$/, '')}_thumb.pdf`

    // Upload the thumbnail
    const { error: uploadError } = await supabase
      .storage
      .from('pdf_newspapers')
      .upload(thumbnailPath, thumbnailBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      throw new Error('Failed to upload thumbnail')
    }

    // Get the public URL for the thumbnail
    const { data: { publicUrl } } = supabase
      .storage
      .from('pdf_newspapers')
      .getPublicUrl(thumbnailPath)

    return new Response(
      JSON.stringify({ 
        message: 'Thumbnail generated successfully',
        thumbnailPath,
        publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate thumbnail', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})