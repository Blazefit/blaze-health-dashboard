'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSupplements } from '@/hooks/useSupplements';
import { PeptideCycleCalendar } from '@/components/supplements/PeptideCycleCalendar';
import { SupplementEditor } from '@/components/supplements/SupplementEditor';
import {
  Pill, Syringe, CalendarDays, Plus, Pencil, Trash2, Loader2, AlertTriangle, X,
} from 'lucide-react';
import type { Supplement, Contraindication, SupplementProtocol } from '@/lib/types';

const TABS = [
  { id: 'stack', label: 'Daily Stack', Icon: Pill },
  { id: 'peptides', label: 'Peptides', Icon: Syringe },
  { id: 'calendar', label: 'Cycling', Icon: CalendarDays },
];

export default function SupplementsPage() {
  const { activeProtocol, isLoading, mutate } = useSupplements();
  const [activeTab, setActiveTab] = useState('stack');
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showContraForm, setShowContraForm] = useState(false);
  const [contraForm, setContraForm] = useState({ compound: '', reason: '' });

  // Normalize seeded timing values (e.g. 'throughout_day' -> 'active')
  const protocol = useMemo<SupplementProtocol | null>(() => {
    if (!activeProtocol) return null;
    return {
      ...activeProtocol,
      supplements: (activeProtocol.supplements || []).map((s) => ({
        ...s,
        timing: (['morning', 'with_meal', 'bedtime', 'pre_workout', 'post_workout', 'active'].includes(s.timing)
          ? s.timing
          : 'active') as Supplement['timing'],
      })),
    };
  }, [activeProtocol]);

  const supplements = protocol?.supplements || [];
  const peptides = supplements.filter((s) => s.is_peptide);
  const contraindications = protocol?.contraindications || [];

  const saveProtocol = useCallback(
    async (updates: Partial<SupplementProtocol>) => {
      if (!protocol) return;
      setSaving(true);
      try {
        await fetch('/api/supplements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: protocol.id, ...updates }),
        });
        await mutate();
      } catch (err) {
        console.error('Save failed:', err);
      } finally {
        setSaving(false);
      }
    },
    [protocol, mutate],
  );

  function handleSaveSupplement(supp: Supplement) {
    if (!protocol) return;
    const isEdit = editingSupplement !== null;
    let updated: Supplement[];
    if (isEdit) {
      // Replace by matching original name
      updated = supplements.map((s) =>
        s.name === editingSupplement?.name ? supp : s,
      );
    } else {
      updated = [...supplements, supp];
    }
    saveProtocol({ supplements: updated });
    setEditingSupplement(undefined);
  }

  function handleDeleteSupplement(name: string) {
    if (!protocol) return;
    const updated = supplements.filter((s) => s.name !== name);
    saveProtocol({ supplements: updated });
    setConfirmDelete(null);
  }

  function handleAddContraindication() {
    if (!protocol || !contraForm.compound.trim() || !contraForm.reason.trim()) return;
    const updated: Contraindication[] = [
      ...contraindications,
      {
        compound: contraForm.compound,
        reason: contraForm.reason,
        confirmed_date: new Date().toISOString().split('T')[0],
      },
    ];
    saveProtocol({ contraindications: updated });
    setShowContraForm(false);
    setContraForm({ compound: '', reason: '' });
  }

  function handleRemoveContraindication(compound: string) {
    if (!protocol) return;
    const updated = contraindications.filter((c) => c.compound !== compound);
    saveProtocol({ contraindications: updated });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--green)' }} />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Supplements</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>Protocol management and cycling</p>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center"
          style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
        >
          <div className="mb-4 rounded-full p-4" style={{ background: 'var(--surface-2)' }}>
            <Pill className="h-8 w-8" style={{ color: 'var(--muted)' }} />
          </div>
          <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            No supplement protocol yet
          </h3>
          <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
            Create a protocol to start tracking your supplement and peptide stack.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Supplements</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {protocol.name} · {supplements.length} compounds · {peptides.length} peptides
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--green)' }} />}
          <button
            onClick={() => setEditingSupplement(null)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: 'var(--green)' }}
          >
            <Plus className="h-4 w-4" />
            Add Compound
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface)' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--surface-2)' : 'transparent',
                color: isActive ? 'var(--foreground)' : 'var(--muted)',
              }}
            >
              <tab.Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'peptides' && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
                >
                  {peptides.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Stack Tab */}
      {activeTab === 'stack' && (
        <div className="space-y-5">
          {/* Editable timeline grouped by timing */}
          <EditableTimeline
            supplements={supplements}
            onEdit={(s) => setEditingSupplement(s)}
            onDelete={(name) => setConfirmDelete(name)}
          />
          {/* Contraindications */}
          <ContraindicationSection
            contraindications={contraindications}
            showForm={showContraForm}
            form={contraForm}
            onToggleForm={() => setShowContraForm((v) => !v)}
            onFormChange={setContraForm}
            onAdd={handleAddContraindication}
            onRemove={handleRemoveContraindication}
          />
        </div>
      )}

      {/* Peptides Tab */}
      {activeTab === 'peptides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {peptides.length} active peptide{peptides.length !== 1 ? 's' : ''} — cycled on structured on/off schedules.
            </p>
            <button
              onClick={() => {
                setEditingSupplement(null);
                // Pre-set is_peptide in the editor
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:brightness-110"
              style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Peptide
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {peptides.map((s) => (
              <EditablePeptideCard
                key={s.name}
                supplement={s}
                onEdit={() => setEditingSupplement(s)}
                onDelete={() => setConfirmDelete(s.name)}
              />
            ))}
          </div>
          {peptides.length === 0 && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
            >
              <Syringe className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--muted-2)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>No peptides in current protocol.</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && <PeptideCycleCalendar />}

      {/* Supplement Editor Modal */}
      {editingSupplement !== undefined && (
        <SupplementEditor
          supplement={editingSupplement}
          onSave={handleSaveSupplement}
          onCancel={() => setEditingSupplement(undefined)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--background)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full p-2" style={{ background: 'var(--red-bg)' }}>
                <Trash2 className="h-5 w-5" style={{ color: 'var(--red)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Remove {confirmDelete}?</h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>This will remove it from your active protocol.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{ color: 'var(--muted)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSupplement(confirmDelete)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--red)' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Editable Timeline ──────────────────────────────────────

const TIMING_GROUPS = [
  { key: 'morning', label: 'Morning', color: 'var(--amber)' },
  { key: 'with_meal', label: 'With Meal', color: 'var(--green)' },
  { key: 'bedtime', label: 'Bedtime', color: 'var(--blue)' },
  { key: 'pre_workout', label: 'Pre-Workout', color: 'var(--green)' },
  { key: 'post_workout', label: 'Post-Workout', color: 'var(--green)' },
  { key: 'active', label: 'Active Compounds', color: 'var(--purple)' },
];

function EditableTimeline({
  supplements,
  onEdit,
  onDelete,
}: {
  supplements: Supplement[];
  onEdit: (s: Supplement) => void;
  onDelete: (name: string) => void;
}) {
  const groups = TIMING_GROUPS.map((g) => ({
    ...g,
    items: supplements.filter((s) => s.timing === g.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.key} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'var(--surface-2)' }}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ background: group.color }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {group.label}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--muted-2)' }}>
              {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div style={{ background: 'var(--surface)' }}>
            {group.items.map((supp) => (
              <div
                key={supp.name}
                className="flex items-center gap-3 px-4 py-3 group"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {supp.name}
                    </span>
                    {supp.is_peptide && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}
                      >
                        Peptide
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {supp.dose} {supp.unit} · {supp.frequency}
                    {supp.is_peptide && supp.cycle_on_weeks ? ` · ${supp.cycle_on_weeks}w on / ${supp.cycle_off_weeks}w off` : ''}
                  </p>
                  {supp.genomic_rationale && (
                    <p className="text-xs mt-1 italic" style={{ color: 'var(--muted-2)' }}>
                      {supp.genomic_rationale}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onEdit(supp)}
                    className="rounded-lg p-2 hover:bg-white/[0.06] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />
                  </button>
                  <button
                    onClick={() => onDelete(supp.name)}
                    className="rounded-lg p-2 hover:bg-white/[0.06] transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" style={{ color: 'var(--red)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Editable Peptide Card ──────────────────────────────────

function EditablePeptideCard({
  supplement,
  onEdit,
  onDelete,
}: {
  supplement: Supplement;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl p-5 group" style={{ background: 'var(--surface)', border: '1px solid rgba(155, 122, 255, 0.2)' }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <div className="rounded-lg p-1.5" style={{ background: 'var(--purple-bg)' }}>
            <Syringe className="h-4 w-4" style={{ color: 'var(--purple)' }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{supplement.name}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {supplement.dose} {supplement.unit}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="rounded-lg p-1.5 hover:bg-white/[0.06]" title="Edit">
            <Pencil className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />
          </button>
          <button onClick={onDelete} className="rounded-lg p-1.5 hover:bg-white/[0.06]" title="Remove">
            <Trash2 className="h-3.5 w-3.5" style={{ color: 'var(--red)' }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg p-2" style={{ background: 'var(--surface-2)' }}>
          <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--muted-2)' }}>Timing</p>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{supplement.timing.replace('_', ' ')}</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'var(--surface-2)' }}>
          <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--muted-2)' }}>Frequency</p>
          <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{supplement.frequency}</p>
        </div>
      </div>

      {supplement.cycle_on_weeks && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3"
          style={{ background: 'var(--purple-bg)', border: '1px solid rgba(155, 122, 255, 0.15)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--purple)' }}>
            Cycle: {supplement.cycle_on_weeks}w on / {supplement.cycle_off_weeks}w off
          </p>
        </div>
      )}

      {supplement.genomic_rationale && (
        <p className="text-xs italic pt-2.5 mt-2.5" style={{ color: 'var(--muted-2)', borderTop: '1px solid var(--border)' }}>
          {supplement.genomic_rationale}
        </p>
      )}
    </div>
  );
}

// ── Contraindication Section ───────────────────────────────

function ContraindicationSection({
  contraindications,
  showForm,
  form,
  onToggleForm,
  onFormChange,
  onAdd,
  onRemove,
}: {
  contraindications: Contraindication[];
  showForm: boolean;
  form: { compound: string; reason: string };
  onToggleForm: () => void;
  onFormChange: (f: { compound: string; reason: string }) => void;
  onAdd: () => void;
  onRemove: (compound: string) => void;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255, 90, 101, 0.2)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--red-bg)' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" style={{ color: 'var(--red)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--red)' }}>
            Contraindications ({contraindications.length})
          </span>
        </div>
        <button
          onClick={onToggleForm}
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:brightness-110"
          style={{ background: 'rgba(255, 90, 101, 0.15)', color: 'var(--red)' }}
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="px-4 py-3 space-y-3" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <input
            type="text"
            value={form.compound}
            onChange={(e) => onFormChange({ ...form, compound: e.target.value })}
            placeholder="Compound name (e.g. CJC-1295)"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          <textarea
            rows={2}
            value={form.reason}
            onChange={(e) => onFormChange({ ...form, reason: e.target.value })}
            placeholder="Reason for contraindication..."
            className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
          <button
            onClick={onAdd}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: 'var(--red)' }}
          >
            Add Contraindication
          </button>
        </div>
      )}

      {contraindications.length > 0 && (
        <div style={{ background: 'var(--surface)' }}>
          {contraindications.map((ci) => (
            <div key={ci.compound} className="flex items-start gap-3 px-4 py-3 group" style={{ borderBottom: '1px solid var(--border)' }}>
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--red)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--red)' }}>{ci.compound}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ci.reason}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--muted-2)' }}>
                  Confirmed {new Date(ci.confirmed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => onRemove(ci.compound)}
                className="rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/[0.06]"
                title="Remove"
              >
                <X className="h-3.5 w-3.5" style={{ color: 'var(--red)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {contraindications.length === 0 && !showForm && (
        <div className="px-4 py-6 text-center" style={{ background: 'var(--surface)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-2)' }}>No contraindications logged.</p>
        </div>
      )}
    </div>
  );
}
