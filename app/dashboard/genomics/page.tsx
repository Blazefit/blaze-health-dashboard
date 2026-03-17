'use client';

import { useState, useMemo } from 'react';
import { useGenomics } from '@/hooks/useGenomics';
import { useDemo } from '@/hooks/useDemo';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Dna } from 'lucide-react';
import { SnpGrid } from '@/components/genomics/SnpGrid';
import { ActionableFindings } from '@/components/genomics/ActionableFindings';
import { CategoryFilter } from '@/components/genomics/CategoryFilter';
import type { SnpCategory } from '@/lib/types';

export default function GenomicsPage() {
  const { isDemo } = useDemo();
  const { snps, isLoading } = useGenomics();
  const [activeCategory, setActiveCategory] = useState<SnpCategory | null>(null);

  // Per-category counts for filter badges — hooks must be called before any early return
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: snps.length };
    snps.forEach((s) => {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    });
    return counts;
  }, [snps]);

  const filteredSnps = useMemo(
    () => (activeCategory ? snps.filter((s) => s.category === activeCategory) : snps),
    [snps, activeCategory]
  );

  const actionableCount = filteredSnps.filter((s) => s.risk_level !== 'clear').length;

  // Empty state when not in demo mode and no data
  if (!isDemo && !isLoading && snps.length === 0) {
    return (
      <div className="p-6">
        <PageHeader title="Genomics" description="Genomic intelligence panel" />
        <EmptyState
          icon={Dna}
          title="No genomic data"
          description="Upload your AncestryDNA or 23andMe raw data file to see your SNP analysis and personalized recommendations."
          ctaLabel="Upload DNA Data"
          ctaHref="/dashboard/upload"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Genomics"
        description={`Genomic intelligence panel — ${snps.length} SNPs analyzed`}
      >
        {actionableCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {actionableCount} actionable
          </span>
        )}
      </PageHeader>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Category filter */}
          <div className="mb-6">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              counts={categoryCounts as Record<SnpCategory | 'all', number>}
            />
          </div>

          {/* SNP Grid */}
          <Card className="mb-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              SNP Status Grid
            </h2>
            <SnpGrid snps={filteredSnps} />
          </Card>

          {/* Actionable Findings */}
          <ActionableFindings snps={filteredSnps} />
        </>
      )}
    </div>
  );
}
