import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = Number(request.nextUrl.searchParams.get('days') || '30');

  const { data, error } = await supabase
    .from('garmin_daily')
    .select('*')
    .eq('user_id', profile.id)
    .order('date', { ascending: true })
    .limit(days);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('garmin_daily')
    .insert({ ...body, user_id: profile.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
