import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';
import { parseCgmCsv } from '@/lib/parsers/cgm';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { upload_id } = await request.json();

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

    const { readings, summary } = parseCgmCsv(csvContent, profile.id);

    const batchSize = 500;
    for (let i = 0; i < readings.length; i += batchSize) {
      const batch = readings.slice(i, i + batchSize).map((r) => ({
        ...r,
        upload_id,
      }));
      const { error } = await supabase.from('cgm_readings').insert(batch);
      if (error) throw error;
    }

    const { error: summaryError } = await supabase
      .from('cgm_summaries')
      .insert({ ...summary, upload_id });
    if (summaryError) throw summaryError;

    await supabase
      .from('uploads')
      .update({ parsed_status: 'complete', parsed_at: new Date().toISOString() })
      .eq('id', upload_id);

    return NextResponse.json({
      success: true,
      readings_imported: readings.length,
      summary,
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
