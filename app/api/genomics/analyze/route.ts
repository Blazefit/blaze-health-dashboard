import { NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';
import { generateWithClaude } from '@/lib/anthropic';

export async function POST() {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get all SNPs for analysis
  const { data: snps } = await supabase
    .from('genomic_snps')
    .select('*')
    .eq('user_id', profile.id);

  if (!snps || snps.length === 0) {
    return NextResponse.json({ error: 'No genomic data found' }, { status: 404 });
  }

  const response = await generateWithClaude({
    model: 'claude-sonnet-4-20250514',
    system: `You are a clinical genomics analyst. Analyze the user's SNP data and provide actionable findings.
For each significant finding, explain the gene variant, its impact, and specific recommendations.
Group findings by category and prioritize by clinical significance.
Return a JSON array of findings: [{"gene": "string", "rsid": "string", "genotype": "string", "risk_level": "string", "category": "string", "finding": "string", "recommendation": "string", "priority": "high|medium|low"}]`,
    messages: [
      { role: 'user', content: `Analyze these SNPs:\n${JSON.stringify(snps)}` },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return NextResponse.json({ analysis: text });
}
