import { NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('genomic_snps')
    .select('*')
    .eq('user_id', profile.id)
    .order('category');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
