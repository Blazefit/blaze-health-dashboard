import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';
import { extractDnaZip, analyzeDnaSnps } from '@/lib/parsers/dna';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const { upload_id } = await request.json();

  // Update upload status
  await supabase
    .from('uploads')
    .update({ parsed_status: 'processing' })
    .eq('id', upload_id);

  try {
    // Download file from storage
    const { data: upload } = await supabase
      .from('uploads')
      .select('file_url')
      .eq('id', upload_id)
      .single();

    if (!upload) throw new Error('Upload not found');

    const response = await fetch(upload.file_url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Parse DNA data
    const rawSnps = extractDnaZip(buffer);
    const analyzed = analyzeDnaSnps(rawSnps, profile.id);

    // Upsert SNPs
    if (analyzed.length > 0) {
      const { error } = await supabase
        .from('genomic_snps')
        .upsert(analyzed, { onConflict: 'user_id,rsid' });

      if (error) throw error;
    }

    // Update upload status
    await supabase
      .from('uploads')
      .update({ parsed_status: 'complete', parsed_at: new Date().toISOString() })
      .eq('id', upload_id);

    return NextResponse.json({
      success: true,
      snps_found: rawSnps.length,
      snps_matched: analyzed.length,
    });
  } catch (error) {
    await supabase
      .from('uploads')
      .update({ parsed_status: 'failed' })
      .eq('id', upload_id);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Parse failed' },
      { status: 500 }
    );
  }
}
