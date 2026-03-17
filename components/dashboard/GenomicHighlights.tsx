import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/StatusPill';

interface SnpHighlight {
  gene: string;
  genotype: string;
  risk: 'clear' | 'heterozygous' | 'homozygous_risk';
}

const demoHighlights: SnpHighlight[] = [
  { gene: 'MTHFR C677T', genotype: 'CT', risk: 'heterozygous' },
  { gene: 'COMT', genotype: 'AG', risk: 'heterozygous' },
  { gene: 'ACTN3', genotype: 'TT', risk: 'homozygous_risk' },
  { gene: 'FADS1', genotype: 'TT', risk: 'homozygous_risk' },
  { gene: 'VDR Fok1', genotype: 'CT', risk: 'heterozygous' },
  { gene: 'SOD2', genotype: 'TT', risk: 'homozygous_risk' },
  { gene: 'FTO', genotype: 'TA', risk: 'heterozygous' },
  { gene: 'APOE', genotype: 'E3/E3', risk: 'clear' },
];

const riskVariant: Record<string, 'green' | 'yellow' | 'red'> = {
  clear: 'green',
  heterozygous: 'yellow',
  homozygous_risk: 'red',
};

export function GenomicHighlights() {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Genomic Highlights
      </h2>
      <div className="flex flex-wrap gap-2">
        {demoHighlights.map((snp) => (
          <div
            key={snp.gene}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
              snp.risk === 'clear'
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                : snp.risk === 'heterozygous'
                ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30'
                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
            }`}
          >
            <span className="font-semibold text-gray-900 dark:text-white">{snp.gene}</span>
            <StatusPill label={snp.genotype} variant={riskVariant[snp.risk]} />
          </div>
        ))}
      </div>
    </Card>
  );
}
