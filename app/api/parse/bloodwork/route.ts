import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';
import { parseBloodworkCsv } from '@/lib/parsers/bloodwork';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { upload_id, source, date } = await request.json();

  await supabase
    .from('uploads')
    .update({ parsed_status: 'processing' })
    .eq('id', upload_id);

  try {
    const { data: upload } = await supabase
      .from('uploads')
      .select('file_url')
      .eq('id', upload_id)
      .single();

    if (!upload) throw new Error('Upload not found');

    const response = await fetch(upload.file_url);
    const csvContent = await response.text();

    const biomarkers = parseBloodworkCsv(csvContent, profile.id, source, date);

    if (biomarkers.length > 0) {
      const { error } = await supabase.from('biomarkers').insert(
        biomarkers.map((b) => ({ ...b, upload_id }))
      );
      if (error) throw error;
    }

    await supabase
      .from('uploads')
      .update({ parsed_status: 'complete', parsed_at: new Date().toISOString() })
      .eq('id', upload_id);

    return NextResponse.json({
      success: true,
      markers_imported: biomarkers.length,
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
