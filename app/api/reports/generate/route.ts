import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, getAuthenticatedProfile } from '@/lib/supabase';
import { generateWithClaude } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const profile = await getAuthenticatedProfile(supabase);
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Re-fetch profile with full details for the report
  const { data: fullProfile } = await supabase
    .from('profiles').select('*').eq('id', profile.id).single();

  const { report_type = 'comprehensive' } = await request.json();

  // Assemble all relevant data
  const [snps, biomarkers, cgmSummary, garmin, supplements, notes] = await Promise.all([
    supabase.from('genomic_snps').select('*').eq('user_id', profile.id),
    supabase.from('biomarkers').select('*').eq('user_id', profile.id).order('date', { ascending: false }).limit(100),
    supabase.from('cgm_summaries').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(1),
    supabase.from('garmin_daily').select('*').eq('user_id', profile.id).order('date', { ascending: false }).limit(30),
    supabase.from('supplement_protocols').select('*').eq('user_id', profile.id).eq('is_active', true),
    supabase.from('health_notes').select('*').eq('user_id', profile.id).order('date', { ascending: false }).limit(20),
  ]);

  const systemPrompt = `You are an expert health intelligence analyst creating a ${report_type} health report for a patient.
Analyze ALL provided data and create cross-references between genomic markers and biomarker values.

Patient: ${fullProfile?.full_name || 'Unknown'}, ${fullProfile?.sex || 'unknown'}, Age: calculated from ${fullProfile?.date_of_birth || 'unknown'}

INSTRUCTIONS:
- Cross-reference genomic data with biomarker values (e.g., "FADS1 TT + low omega-3 index = confirmed conversion deficit")
- Identify patterns across data sources (e.g., CGM evening lows + Garmin wake events + genomic insulin sensitivity)
- Prioritize findings by clinical significance
- Provide specific, actionable recommendations tied to data
- Suggest follow-up tests with rationale and timing
- Flag any supplement-biomarker interactions

Return ONLY valid JSON:
{
  "executive_summary": "string",
  "key_findings": [{"title": "string", "severity": "high|medium|low", "description": "string", "data_points": ["string"]}],
  "data_source_analysis": {"genomics": "string", "biomarkers": "string", "cgm": "string", "wearables": "string"},
  "cross_references": [{"genomic_marker": "string", "biomarker": "string", "finding": "string", "recommendation": "string"}],
  "risk_assessment": [{"area": "string", "level": "high|medium|low", "description": "string", "mitigations": ["string"]}],
  "recommendations": [{"category": "string", "action": "string", "rationale": "string", "priority": "high|medium|low"}],
  "follow_up_schedule": [{"test": "string", "rationale": "string", "timing": "string"}]
}`;

  const dataPayload = JSON.stringify({
    genomic_snps: snps.data || [],
    biomarkers: biomarkers.data || [],
    cgm_summary: cgmSummary.data?.[0] || null,
    garmin_recent: garmin.data?.slice(0, 7) || [],
    active_supplements: supplements.data || [],
    recent_notes: notes.data || [],
  });

  try {
    const response = await generateWithClaude({
      model: 'claude-opus-4-6',
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Here is my health data:\n\n${dataPayload}\n\nGenerate the ${report_type} report.` },
      ],
      maxTokens: 8192,
    });

    const text = response.content[0].text;

    let reportContent;
    try {
      reportContent = JSON.parse(text);
    } catch {
      const match = text.match(/```json?\s*([\s\S]*?)```/);
      reportContent = match ? JSON.parse(match[1]) : { executive_summary: text, key_findings: [], data_source_analysis: {}, cross_references: [], risk_assessment: [], recommendations: [], follow_up_schedule: [] };
    }

    await supabase
      .from('health_reports')
      .update({ status: 'superseded' })
      .eq('user_id', profile.id)
      .eq('status', 'current');

    const { data: report, error } = await supabase
      .from('health_reports')
      .insert({
        user_id: profile.id,
        title: `${report_type.charAt(0).toUpperCase() + report_type.slice(1)} Health Report`,
        report_type,
        status: 'current',
        summary: reportContent.executive_summary?.slice(0, 500),
        full_report: reportContent,
        data_sources: ['genomic_snps', 'biomarkers', 'cgm_summaries', 'garmin_daily', 'supplement_protocols', 'health_notes'],
        model_used: 'claude-opus-4-6',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Report generation failed' },
      { status: 500 }
    );
  }
}
