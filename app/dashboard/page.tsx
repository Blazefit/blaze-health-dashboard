'use client';

import { useBiomarkers } from '@/hooks/useBiomarkers';
import { useGenomics } from '@/hooks/useGenomics';
import { useLatestGarmin } from '@/hooks/useGarmin';
import { useActiveProgram } from '@/hooks/useTraining';

/* ── Helpers ─────────────────────────────── */
const fmt = (v: number, unit: string) => `${v}${unit ? ` ${unit}` : ''}`;

/* ── Main Page ───────────────────────────── */
export default function DashboardPage() {
  const { biomarkers } = useBiomarkers();
  const { snps } = useGenomics();
  const { latest: garmin } = useLatestGarmin();
  const { program } = useActiveProgram();

  // Derive latest biomarker values
  const latestMap = new Map<string, { value: number; unit: string; status: string; notes?: string; date: string }>();
  biomarkers.forEach((b) => {
    const existing = latestMap.get(b.marker_name);
    if (!existing || b.date > existing.date) {
      latestMap.set(b.marker_name, { value: b.value, unit: b.unit, status: b.status, notes: b.notes, date: b.date });
    }
  });

  const bm = (name: string) => latestMap.get(name);
  const glucose = bm('Fasting Glucose');
  const ferritin = bm('Ferritin');
  const ldlp = bm('LDL-P');

  // Genomic risk categorization
  const clearSnps = snps.filter((s) => s.risk_level === 'clear');
  const heteroSnps = snps.filter((s) => s.risk_level === 'heterozygous');
  const homoSnps = snps.filter((s) => s.risk_level === 'homozygous_risk');

  // Sleep data
  const sleep = garmin ? {
    total: `${Math.floor(garmin.sleep_total_minutes / 60)}h ${garmin.sleep_total_minutes % 60}m`,
    score: garmin.sleep_score,
    deep: garmin.sleep_deep_minutes,
    light: garmin.sleep_light_minutes,
    rem: garmin.sleep_rem_minutes,
    awake: garmin.sleep_awake_minutes,
    wakeEvents: garmin.sleep_wake_events,
  } : null;

  const sleepTotal = sleep ? sleep.deep + sleep.light + sleep.rem + sleep.awake : 0;

  return (
    <div className="p-7 max-w-[1200px]" style={{ color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight" style={{ letterSpacing: '-0.3px' }}>Blaze Health</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>Health OS for serious athletes &amp; biohackers</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'var(--green-bg)',
            color: 'var(--green)',
            border: '1px solid rgba(0,214,143,0.15)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--green)' }} />
          All systems synced
        </div>
      </div>

      {/* AI Daily Brief */}
      <div
        className="rounded-[14px] p-5 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,214,143,0.06), rgba(78,168,255,0.04))',
          border: '1px solid rgba(0,214,143,0.1)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,214,143,0.3), transparent)' }} />
        <div className="flex items-center gap-2 mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--green)' }}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-3.5 w-3.5" style={{ stroke: 'var(--green)' }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          AI daily brief — {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <p className="text-sm leading-relaxed">
          Recovery is <strong style={{ color: 'var(--green)', fontWeight: 500 }}>good</strong> today
          {garmin ? ` — HRV at ${garmin.hrv_overnight_avg}ms, resting HR ${garmin.resting_hr}` : ''}.
          {sleep && sleep.wakeEvents > 0 && (
            <> Sleep was {sleep.total} with <span style={{ color: 'var(--red)' }}>{sleep.wakeEvents} wake events</span> correlating with your <span style={{ color: 'var(--red)' }}>CGM evening low pattern</span>. </>
          )}
          {program && (
            <>You&apos;re on <strong style={{ color: 'var(--green)', fontWeight: 500 }}>Week {program.current_week}</strong> of {program.duration_weeks}. </>
          )}
          {ferritin && ferritin.status === 'flagged' && (
            <><span style={{ color: 'var(--amber)' }}>Ferritin and LDL-P remain elevated</span> — blood donation still recommended. </>
          )}
          Vitamin D retest due in ~4 weeks.
        </p>
      </div>

      {/* Score Ring + Quick Metrics */}
      <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: '200px 1fr' }}>
        {/* Score Ring */}
        <div
          className="flex flex-col items-center justify-center rounded-[14px] p-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="relative w-[120px] h-[120px]">
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00D68F" />
                  <stop offset="100%" stopColor="#4EA8FF" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-3)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                strokeLinecap="round" strokeDasharray="339.292" strokeDashoffset="61" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold" style={{
                letterSpacing: '-1px',
                background: 'linear-gradient(135deg, var(--green), var(--blue))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>82</span>
              <span className="text-[11px] -mt-0.5" style={{ color: 'var(--muted)' }}>of 100</span>
            </div>
          </div>
          <div className="text-[13px] font-medium mt-3">Health score</div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>3 flags active</div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="metric-card">
            <div className="metric-card-label">Weight</div>
            <div className="metric-card-value">184<span className="text-sm ml-1" style={{ color: 'var(--muted)' }}>lb</span></div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted-2)' }}>Stable 4 wks</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-label">Avg glucose</div>
            <div className="metric-card-value">{glucose ? Math.round(glucose.value) : 84}<span className="text-sm ml-1" style={{ color: 'var(--muted)' }}>mg/dL</span></div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--red)' }}>8% below 70</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-label">Resting HR</div>
            <div className="metric-card-value">{garmin?.resting_hr || 58}<span className="text-sm ml-1" style={{ color: 'var(--muted)' }}>bpm</span></div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--green)' }}>-2 vs last wk</div>
          </div>
          <div className="metric-card">
            <div className="metric-card-label">Bench 1RM</div>
            <div className="metric-card-value">{program?.config?.bench_1rm || 205}<span className="text-sm ml-1" style={{ color: 'var(--muted)' }}>lb</span></div>
            <div className="text-[11px] mt-1" style={{ color: 'var(--muted-2)' }}>Wk {program?.current_week || '?'} / {program?.duration_weeks || '?'}</div>
          </div>
        </div>
      </div>

      {/* Alert Strip */}
      <div className="section-label">Active risk flags</div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <AlertCard
          color="red"
          title="Nocturnal hypoglycemia"
          detail="29 events / 14 days. Evening lows 53-58 mg/dL causing counter-regulatory waking."
        />
        <AlertCard
          color="red"
          title="Ferritin elevated"
          detail={`${ferritin ? fmt(ferritin.value, ferritin.unit) : '227 ng/mL'} — above optimal 50-150. HFE clear. Blood donation recommended.`}
        />
        <AlertCard
          color="amber"
          title="Atherogenic LDL pattern"
          detail={`LDL-P ${ldlp ? ldlp.value : 1438}, Small LDL 253. AGTR1 CC + FADS1 TT driving particle count.`}
        />
      </div>

      {/* Charts Row: HRV + Glucose */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChartCard title="HRV — 7 day trend" tag="+3 ms vs avg" tagColor="green">
          <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D68F" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00D68F" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <text x="396" y="66" fill="#525E72" fontSize="9" textAnchor="end">47 avg</text>
            <path d="M0,84 L57,72 L114,100 L171,42 L228,56 L285,65 L342,30 L400,30" fill="url(#hrvGrad)" />
            <path d="M0,84 L57,72 L114,100 L171,42 L228,56 L285,65 L342,30 L400,30" fill="none" stroke="#00D68F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="342" cy="30" r="4" fill="#00D68F" />
            <circle cx="342" cy="30" r="8" fill="#00D68F" opacity="0.2" />
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
              <text key={d} x={i * 57} y="136" fill={i === 6 ? '#00D68F' : '#525E72'} fontSize="9" fontWeight={i === 6 ? '500' : '400'}>{d}</text>
            ))}
          </svg>
        </ChartCard>
        <ChartCard title="Glucose — 14 day trend" tag="8% below 70" tagColor="red">
          <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="gluGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B7AFF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#9B7AFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="0" y="105" width="400" height="35" fill="rgba(255,90,101,0.04)" rx="0" />
            <line x1="0" y1="105" x2="400" y2="105" stroke="rgba(255,90,101,0.15)" strokeDasharray="4 4" />
            <text x="396" y="101" fill="#FF5A65" fontSize="9" textAnchor="end" opacity="0.6">70</text>
            <line x1="0" y1="55" x2="400" y2="55" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <text x="396" y="51" fill="#525E72" fontSize="9" textAnchor="end">100</text>
            <path d="M0,65 L28,60 L57,68 L85,78 L114,62 L142,90 L171,110 L200,118 L228,100 L257,70 L285,55 L314,65 L342,82 L371,108 L400,90" fill="url(#gluGrad)" />
            <path d="M0,65 L28,60 L57,68 L85,78 L114,62 L142,90 L171,110 L200,118 L228,100 L257,70 L285,55 L314,65 L342,82 L371,108 L400,90" fill="none" stroke="#9B7AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="171" cy="110" r="3.5" fill="#FF5A65" />
            <circle cx="200" cy="118" r="3.5" fill="#FF5A65" />
            <circle cx="371" cy="108" r="3.5" fill="#FF5A65" />
          </svg>
        </ChartCard>
      </div>

      {/* Sleep Card */}
      <div className="rounded-[14px] p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="section-label" style={{ margin: '0 0 6px' }}>Last night&apos;s sleep</div>
            <div className="text-[28px] font-medium" style={{ letterSpacing: '-0.5px' }}>{sleep?.total || '7h 24m'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Score: {sleep?.score || 74} / 100</div>
            <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-xl" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>
              {sleep?.wakeEvents || 2} wake events
            </span>
          </div>
        </div>
        <div className="flex h-7 rounded-lg overflow-hidden mb-2.5">
          <div style={{ width: `${sleepTotal ? ((sleep!.deep / sleepTotal) * 100) : 22}%`, background: 'linear-gradient(135deg, #6C4AE0, #9B7AFF)' }} />
          <div style={{ width: `${sleepTotal ? ((sleep!.light / sleepTotal) * 100) : 38}%`, background: '#3D4A60' }} />
          <div style={{ width: `${sleepTotal ? ((sleep!.rem / sleepTotal) * 100) : 18}%`, background: 'linear-gradient(135deg, #00B876, #00D68F)' }} />
          <div style={{ width: `${sleepTotal ? ((sleep!.awake / sleepTotal) * 100) : 6}%`, background: '#FFB547' }} />
        </div>
        <div className="flex gap-5 text-[11px]" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(135deg, #6C4AE0, #9B7AFF)' }} />Deep {sleep?.deep || 97}m</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#3D4A60' }} />Light {sleep?.light || 169}m</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(135deg, #00B876, #00D68F)' }} />REM {sleep?.rem || 80}m</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#FFB547' }} />Awake {sleep?.awake || 26}m</span>
        </div>
        <div className="mt-3 px-3.5 py-2.5 rounded-md text-xs leading-relaxed" style={{
          background: 'rgba(255,90,101,0.05)',
          border: '1px solid rgba(255,90,101,0.08)',
          color: 'var(--muted)',
        }}>
          <strong style={{ color: 'var(--red)', fontWeight: 500 }}>CGM correlation:</strong> Wake events between 1-3 AM coincide with glucose dipping to 54 mg/dL. Counter-regulatory cortisol/adrenaline surge is the wake trigger — not circadian disruption (CLOCK gene is normal).
        </div>
      </div>

      {/* Genomic Highlights */}
      <div className="rounded-[14px] p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-medium">Genomic highlights</span>
          <span className="text-[11px]" style={{ color: 'var(--muted-2)' }}>{snps.length} SNPs analyzed &rarr;</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {clearSnps.slice(0, 5).map((s) => (
            <GenePill key={s.rsid} gene={`${s.gene_name} ${s.variant_name || s.genotype}`} risk="clear" />
          ))}
          {heteroSnps.slice(0, 4).map((s) => (
            <GenePill key={s.rsid} gene={`${s.gene_name} ${s.genotype}`} risk="hetero" />
          ))}
          {homoSnps.map((s) => (
            <GenePill key={s.rsid} gene={`${s.gene_name} ${s.genotype}`} risk="homo" />
          ))}
        </div>
      </div>

      {/* Training + Supplements Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Training */}
        <div className="rounded-[14px] p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-medium">
              This week — Wk {program?.current_week || '?'} / {program?.duration_weeks || '?'}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-xl" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Volume peak</span>
          </div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
            const labels = [
              'Sheiko bench + squat',
              'Arms & delts',
              'Heavy primer 80% + bench hyp',
              'Lower body (no axial)',
              'Sheiko bench + squat',
              'Upper back',
            ];
            const dayOfWeek = new Date().getDay();
            const dayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const status = i < dayIdx ? 'done' : i === dayIdx ? 'today' : 'up';
            return (
              <div key={day} className="flex items-center gap-2.5 py-[7px] text-xs" style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                <span className="font-medium min-w-[30px]" style={{ color: 'var(--green)' }}>{day}</span>
                <span className="flex-1">{labels[i]}</span>
                <span className="px-2 py-0.5 rounded-[10px] text-[10px] font-medium" style={{
                  background: status === 'done' ? 'var(--green-bg)' : status === 'today' ? 'var(--blue-bg)' : 'rgba(255,255,255,0.03)',
                  color: status === 'done' ? 'var(--green)' : status === 'today' ? 'var(--blue)' : 'var(--muted-2)',
                }}>
                  {status === 'done' ? 'Done' : status === 'today' ? 'Today' : i === dayIdx + 1 ? 'Up next' : '-'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Supplements */}
        <div className="rounded-[14px] p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-medium">Today&apos;s protocol</span>
            <span className="text-[11px]" style={{ color: 'var(--muted-2)' }}>11 compounds &rarr;</span>
          </div>
          {[
            { name: 'Protein shake', dose: 'AM', done: true },
            { name: 'SPIKE MB-0.1', dose: 'Sip all day', done: true },
            { name: 'D3 10,000 IU + K2', dose: 'w/ fattiest meal', done: false },
            { name: 'Selenomethionine', dose: 'w/ meal', done: false },
            { name: 'Mg glycinate', dose: 'Bedtime', done: false },
            { name: 'Ipamorelin', dose: 'Pre-bed', done: false },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-2 py-1.5 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span className="flex-1 font-medium">{s.name}</span>
              <span className="min-w-[80px]" style={{ color: 'var(--muted)' }}>{s.dose}</span>
              <span className="min-w-[20px] text-right text-[11px]" style={{ color: s.done ? 'var(--green)' : 'var(--muted-2)' }}>
                {s.done ? '\u2713' : '\u25CB'}
              </span>
            </div>
          ))}
          <div className="mt-2 px-3 py-2 rounded-md text-[11px]" style={{
            background: 'rgba(255,90,101,0.04)',
            border: '1px solid rgba(255,90,101,0.06)',
            color: 'var(--muted)',
          }}>
            <span style={{ color: 'var(--red)', fontWeight: 500 }}>&#9888; CJC-1295 contraindicated</span> — histamine reaction confirmed
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────── */

function AlertCard({ color, title, detail }: { color: 'red' | 'amber'; title: string; detail: string }) {
  const isRed = color === 'red';
  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-[10px]" style={{
      background: isRed ? 'var(--red-bg)' : 'var(--amber-bg)',
      border: `1px solid ${isRed ? 'rgba(255,90,101,0.12)' : 'rgba(255,181,71,0.12)'}`,
    }}>
      <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg" style={{
        background: isRed ? 'rgba(255,90,101,0.15)' : 'rgba(255,181,71,0.15)',
      }}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-3.5 w-3.5" style={{ stroke: isRed ? 'var(--red)' : 'var(--amber)' }}>
          {isRed ? (
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          ) : (
            <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>
          )}
        </svg>
      </div>
      <div>
        <div className="text-xs font-medium mb-0.5" style={{ color: isRed ? 'var(--red)' : 'var(--amber)' }}>{title}</div>
        <div className="text-[11px] leading-snug" style={{ color: 'var(--muted)' }}>{detail}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, tag, tagColor, children }: { title: string; tag: string; tagColor: 'green' | 'red' | 'amber'; children: React.ReactNode }) {
  const colorMap = {
    green: { bg: 'var(--green-bg)', color: 'var(--green)' },
    red: { bg: 'var(--red-bg)', color: 'var(--red)' },
    amber: { bg: 'var(--amber-bg)', color: 'var(--amber)' },
  };
  return (
    <div className="rounded-[14px] p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-[13px] font-medium">{title}</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-xl" style={{ background: colorMap[tagColor].bg, color: colorMap[tagColor].color }}>{tag}</span>
      </div>
      <div className="h-[140px] relative">{children}</div>
    </div>
  );
}

function GenePill({ gene, risk }: { gene: string; risk: 'clear' | 'hetero' | 'homo' }) {
  const styles = {
    clear: { bg: 'var(--green-bg)', color: 'var(--green)', border: 'rgba(0,214,143,0.12)', dot: 'var(--green)' },
    hetero: { bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'rgba(255,181,71,0.12)', dot: 'var(--amber)' },
    homo: { bg: 'var(--red-bg)', color: 'var(--red)', border: 'rgba(255,90,101,0.12)', dot: 'var(--red)' },
  };
  const s = styles[risk];
  return (
    <span className="flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[11px] font-medium" style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      <span className="h-[5px] w-[5px] rounded-full" style={{ background: s.dot }} />
      {gene.trim()}
    </span>
  );
}
