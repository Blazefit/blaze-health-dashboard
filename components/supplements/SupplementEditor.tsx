'use client';

import { useState } from 'react';
import { X, Syringe, Pill, Plus } from 'lucide-react';
import type { Supplement } from '@/lib/types';

interface SupplementEditorProps {
  supplement?: Supplement | null;
  onSave: (supplement: Supplement) => void;
  onCancel: () => void;
}

const TIMING_OPTIONS: Array<{ value: Supplement['timing']; label: string }> = [
  { value: 'morning', label: 'Morning' },
  { value: 'with_meal', label: 'With Meal' },
  { value: 'bedtime', label: 'Bedtime' },
  { value: 'pre_workout', label: 'Pre-Workout' },
  { value: 'post_workout', label: 'Post-Workout' },
  { value: 'active', label: 'Active Compound' },
];

const EMPTY_SUPPLEMENT: Supplement = {
  name: '',
  dose: '',
  unit: '',
  timing: 'morning',
  frequency: 'daily',
  genomic_rationale: '',
  notes: '',
  is_peptide: false,
};

export function SupplementEditor({ supplement, onSave, onCancel }: SupplementEditorProps) {
  const [form, setForm] = useState<Supplement>(supplement ? { ...supplement } : { ...EMPTY_SUPPLEMENT });
  const isNew = !supplement;

  function update<K extends keyof Supplement>(key: K, value: Supplement[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--background)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            {form.is_peptide ? (
              <Syringe className="h-5 w-5" style={{ color: 'var(--purple)' }} />
            ) : (
              <Pill className="h-5 w-5" style={{ color: 'var(--green)' }} />
            )}
            <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {isNew ? 'Add Compound' : `Edit ${form.name}`}
            </h2>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg p-2 hover:bg-white/[0.04]">
            <X className="h-5 w-5" style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => update('is_peptide', false)}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              style={{
                background: !form.is_peptide ? 'var(--green-bg)' : 'var(--surface)',
                border: `1px solid ${!form.is_peptide ? 'var(--green)' : 'var(--border)'}`,
                color: !form.is_peptide ? 'var(--green)' : 'var(--muted)',
              }}
            >
              <Pill className="h-4 w-4 inline mr-2" />
              Supplement
            </button>
            <button
              type="button"
              onClick={() => update('is_peptide', true)}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              style={{
                background: form.is_peptide ? 'var(--purple-bg)' : 'var(--surface)',
                border: `1px solid ${form.is_peptide ? 'var(--purple)' : 'var(--border)'}`,
                color: form.is_peptide ? 'var(--purple)' : 'var(--muted)',
              }}
            >
              <Syringe className="h-4 w-4 inline mr-2" />
              Peptide
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
              Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Ipamorelin, Vitamin D3, BPC-157"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Dose + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
                Dose
              </label>
              <input
                type="text"
                value={form.dose}
                onChange={(e) => update('dose', e.target.value)}
                placeholder="e.g. 200, 10000, per cycle"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
                Unit
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => update('unit', e.target.value)}
                placeholder="e.g. mcg, mg, IU"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          {/* Timing + Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
                Timing
              </label>
              <select
                value={form.timing}
                onChange={(e) => update('timing', e.target.value as Supplement['timing'])}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none appearance-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              >
                {TIMING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
                Frequency
              </label>
              <input
                type="text"
                value={form.frequency}
                onChange={(e) => update('frequency', e.target.value)}
                placeholder="e.g. daily, 3x/week, cycled"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          {/* Peptide cycle info */}
          {form.is_peptide && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--purple-bg)', border: '1px solid rgba(155, 122, 255, 0.2)' }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--purple)' }}>
                Peptide Cycling
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Weeks On
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.cycle_on_weeks || ''}
                    onChange={(e) => update('cycle_on_weeks', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 8"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Weeks Off
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.cycle_off_weeks || ''}
                    onChange={(e) => update('cycle_off_weeks', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 4"
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Genomic Rationale */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
              Genomic Rationale
            </label>
            <textarea
              rows={2}
              value={form.genomic_rationale || ''}
              onChange={(e) => update('genomic_rationale', e.target.value)}
              placeholder="Why is this in your protocol? Link to SNP findings..."
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-2)' }}>
              Notes
            </label>
            <textarea
              rows={2}
              value={form.notes || ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Timing notes, interactions, special instructions..."
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/[0.04]"
            style={{ color: 'var(--muted)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: form.is_peptide ? 'var(--purple)' : 'var(--green)' }}
          >
            {isNew ? <Plus className="h-4 w-4" /> : null}
            {isNew ? 'Add to Protocol' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
