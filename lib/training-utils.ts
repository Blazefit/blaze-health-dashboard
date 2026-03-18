import type { TrainingProgram, ProgramDay, ProgramExercise, ProgramWeek } from '@/lib/types';

/**
 * Normalize program_data from various formats into ProgramWeek[].
 * The seed data uses an object format with string-style sets,
 * while AI-generated programs use the structured ProgramWeek[] format.
 */
export function normalizeProgramData(program: TrainingProgram): ProgramWeek[] {
  // Already in the correct format
  if (Array.isArray(program.program_data)) return program.program_data;

  // Seed data format: { note: string, week_7_sample: { monday: { label, exercises } } }
  const data = program.program_data as unknown as Record<string, unknown>;
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  };

  // Find the week sample data (could be week_7_sample or similar)
  let weekData: Record<string, unknown> | null = null;
  for (const key of Object.keys(data)) {
    if (key.includes('week') && typeof data[key] === 'object' && data[key] !== null) {
      weekData = data[key] as Record<string, unknown>;
      break;
    }
  }

  if (!weekData) return [];

  const days: ProgramDay[] = dayOrder
    .filter((d) => weekData![d])
    .map((d) => {
      const dayData = weekData![d] as { label: string; exercises: Array<{ name: string; sets: string; notes?: string }> };
      return {
        day_of_week: dayLabels[d],
        label: dayData.label || dayLabels[d],
        exercises: (dayData.exercises || []).map((ex): ProgramExercise => {
          const setsStr = typeof ex.sets === 'string' ? ex.sets : '';
          const parsedSets = setsStr.split(',').map((s, i) => {
            const part = s.trim();
            const pctMatch = part.match(/(\d+)%\s*x\s*(\d+)(?:\s*x\s*(\d+))?/);
            if (pctMatch) {
              const pct = parseInt(pctMatch[1]);
              const reps = parseInt(pctMatch[2]);
              const setCount = pctMatch[3] ? parseInt(pctMatch[3]) : 1;
              const results = [];
              for (let j = 0; j < setCount; j++) {
                results.push({
                  set_number: i + j + 1,
                  reps,
                  percentage: pct,
                  weight: 0,
                  type: (pct <= 50 ? 'warmup' : pct >= 80 ? 'primer' : 'working') as 'warmup' | 'working' | 'primer' | 'backoff',
                });
              }
              return results;
            }
            const plainMatch = part.match(/(\d+)\s*x\s*(\d+)(?:\s*(?:each|per side))?/);
            if (plainMatch) {
              return [{
                set_number: i + 1,
                reps: parseInt(plainMatch[2]),
                type: 'working' as const,
              }];
            }
            return [];
          }).flat().map((s, idx) => ({ ...s, set_number: idx + 1 }));

          return {
            name: ex.name,
            notes: ex.notes,
            sets: parsedSets.length > 0 ? parsedSets : [{ set_number: 1, reps: 0, type: 'working' as const }],
          };
        }),
      };
    });

  return [{
    week: program.current_week || 1,
    phase: 'Current',
    days,
  }];
}
