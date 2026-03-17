import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateWithClaude } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { duration_weeks, goal, bench_1rm, squat_1rm, days_per_week, constraints, equipment, genomic_notes } =
    await request.json();

  const systemPrompt = `You are an expert strength & conditioning coach who designs periodized training programs.
The user is a 38-year-old male CrossFit gym owner. Design a ${duration_weeks}-week ${goal} program.

IMPORTANT CONSTRAINTS:
${(constraints || []).map((c: string) => `- ${c}`).join('\n')}
${constraints?.includes('no_axial_loading') ? '\nNo deadlifts or barbell back squats. Acceptable substitutes: goblet squats, Bulgarian split squats, GHRs, hip thrusts, leg press, belt squat, walking lunges.' : ''}

CURRENT 1RMs:
- Bench Press: ${bench_1rm} lb
- Squat (reference): ${squat_1rm} lb

GENOMIC NOTES:
${genomic_notes || 'No genomic data provided.'}

Training days per week: ${days_per_week}
Equipment: ${equipment || 'Full commercial gym'}

PROGRAM REQUIREMENTS:
- Calculate all working weights from 1RMs (round to nearest ${5} lb)
- Include warm-up sets
- For hypertrophy: working sets 55-75% of 1RM for 8-15 reps
- Include ONE heavy primer set (80-85% x 3-5 reps) per week on the primary lift
- Progress across weeks: accumulation → intensification → taper
- Include accessory work appropriate for constraints

Return ONLY valid JSON in this exact format:
{
  "name": "Program Name",
  "description": "Brief description",
  "weeks": [
    {
      "week": 1,
      "phase": "Accumulation",
      "days": [
        {
          "day_of_week": "Monday",
          "label": "Bench Primary",
          "exercises": [
            {
              "name": "Bench Press",
              "notes": "Optional notes",
              "sets": [
                {"set_number": 1, "reps": 10, "percentage": 45, "weight": 130, "type": "warmup"},
                {"set_number": 2, "reps": 8, "percentage": 65, "weight": 185, "type": "working"}
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

  try {
    const response = await generateWithClaude({
      model: 'claude-opus-4-6',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a ${duration_weeks}-week ${goal} training program. Return only the JSON.`,
        },
      ],
      maxTokens: 16000,
    });

    const text = response.content[0].text;

    return new Response(text, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
