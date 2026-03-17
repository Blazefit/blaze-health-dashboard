import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const fileType = formData.get('file_type') as string;

  if (!file || !fileType) {
    return NextResponse.json({ error: 'File and file_type required' }, { status: 400 });
  }

  // Upload to Supabase Storage
  const fileName = `${profile.id}/${Date.now()}_${file.name}`;
  const { error: storageError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file);

  if (storageError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  // Create upload record
  const { data: upload, error: uploadError } = await supabase
    .from('uploads')
    .insert({
      user_id: profile.id,
      file_name: file.name,
      file_url: publicUrl,
      file_type: fileType,
      file_size_bytes: file.size,
      parsed_status: 'pending',
    })
    .select()
    .single();

  if (uploadError) {
    return NextResponse.json({ error: 'Failed to create upload record' }, { status: 500 });
  }

  return NextResponse.json({ upload });
}
