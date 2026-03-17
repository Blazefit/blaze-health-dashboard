import AdmZip from 'adm-zip';
import { SNP_DATABASE } from '@/lib/snp-database';
import type { GenomicSnp, RiskLevel } from '@/lib/types';

interface RawSnp {
  rsid: string;
  chromosome: string;
  position: number;
  allele1: string;
  allele2: string;
}

/**
 * Extract and parse AncestryDNA zip file
 * The zip contains a text file with tab-delimited SNP data
 */
export function extractDnaZip(buffer: Buffer): RawSnp[] {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  // Find the DNA data file (usually AncestryDNA.txt or similar)
  const dnaEntry = entries.find(
    (e) =>
      e.entryName.endsWith('.txt') &&
      !e.entryName.startsWith('__MACOSX') &&
      !e.entryName.startsWith('.')
  );

  if (!dnaEntry) {
    throw new Error('No DNA data file found in zip archive');
  }

  const content = dnaEntry.getData().toString('utf-8');
  return parseDnaText(content);
}

/**
 * Parse AncestryDNA text file format
 * Format: rsid \t chromosome \t position \t allele1 \t allele2
 * Lines starting with # are comments
 */
export function parseDnaText(content: string): RawSnp[] {
  const lines = content.split('\n');
  const snps: RawSnp[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split('\t');
    if (parts.length < 4) continue;

    const rsid = parts[0].trim();
    if (!rsid.startsWith('rs')) continue;

    snps.push({
      rsid,
      chromosome: parts[1].trim(),
      position: parseInt(parts[2].trim(), 10),
      allele1: parts[3].trim(),
      allele2: parts[4]?.trim() || parts[3].trim(),
    });
  }

  return snps;
}

/**
 * Determine risk level based on genotype and reference data
 */
function determineRiskLevel(
  allele1: string,
  allele2: string,
  riskAllele: string
): RiskLevel {
  const hasRisk1 = allele1.toUpperCase() === riskAllele.toUpperCase();
  const hasRisk2 = allele2.toUpperCase() === riskAllele.toUpperCase();

  if (hasRisk1 && hasRisk2) return 'homozygous_risk';
  if (hasRisk1 || hasRisk2) return 'heterozygous';
  return 'clear';
}

/**
 * Match raw SNPs against our reference database and return analyzed results
 */
export function analyzeDnaSnps(
  rawSnps: RawSnp[],
  userId: string
): Omit<GenomicSnp, 'id' | 'created_at'>[] {
  const results: Omit<GenomicSnp, 'id' | 'created_at'>[] = [];

  // Build a lookup map for quick rsid matching
  const rawMap = new Map(rawSnps.map((s) => [s.rsid, s]));

  for (const ref of SNP_DATABASE) {
    const raw = rawMap.get(ref.rsid);
    if (!raw) continue;

    const genotype = `${raw.allele1}${raw.allele2}`;
    const riskLevel = determineRiskLevel(raw.allele1, raw.allele2, ref.risk_allele);

    results.push({
      user_id: userId,
      rsid: ref.rsid,
      chromosome: raw.chromosome,
      position: raw.position,
      genotype,
      gene_name: ref.gene,
      variant_name: ref.variant_name || '',
      category: ref.category,
      risk_level: riskLevel,
      risk_allele: ref.risk_allele,
      clinical_significance: ref.clinical_significance,
      actionable_note: ref.actionable_recommendation,
      source: 'ancestrydna',
    });
  }

  return results;
}

/**
 * Compute APOE haplotype from rs429358 and rs7412
 */
export function computeApoeHaplotype(
  snps: { rsid: string; genotype: string }[]
): string | null {
  const rs429358 = snps.find((s) => s.rsid === 'rs429358');
  const rs7412 = snps.find((s) => s.rsid === 'rs7412');

  if (!rs429358 || !rs7412) return null;

  // APOE haplotypes:
  // E2: rs429358=TT, rs7412=CT or CC (has T at rs7412)
  // E3: rs429358=TT, rs7412=CC (most common)
  // E4: rs429358=CT or CC, rs7412=CC (has C at rs429358)
  const has429C = rs429358.genotype.includes('C');
  const has7412T = rs7412.genotype.includes('T');

  if (!has429C && !has7412T) return 'E3/E3';
  if (!has429C && has7412T) return 'E2/E3';
  if (has429C && !has7412T) return 'E3/E4';
  if (has429C && has7412T) return 'E2/E4';
  return null;
}
