import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('clerk_id', userId).single();
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const status = request.nextUrl.searchParams.get('status');
  let query = supabase
    .from('training_programs')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If filtering for active, return single program
  if (status === 'active') {
    return NextResponse.json(data?.[0] || null);
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('clerk_id', userId).single();
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('training_programs')
    .insert({ ...body, user_id: profile.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
