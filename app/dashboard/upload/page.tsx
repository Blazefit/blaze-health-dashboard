'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Dna, Droplets, Activity, Watch, FileText, FlaskConical } from 'lucide-react';

const uploadTypes = [
  {
    id: 'dna',
    title: 'AncestryDNA',
    description: 'Upload your raw DNA zip file for SNP analysis',
    icon: Dna,
    accept: '.zip',
    color: 'text-purple-500',
  },
  {
    id: 'bloodwork',
    title: 'Blood Work CSV',
    description: 'CSV from Rythm Health, Function Health, or generic lab format',
    icon: Droplets,
    accept: '.csv',
    color: 'text-red-500',
  },
  {
    id: 'cgm',
    title: 'CGM Export',
    description: 'FreeStyle Libre CSV glucose data export',
    icon: Activity,
    accept: '.csv',
    color: 'text-blue-500',
  },
  {
    id: 'garmin',
    title: 'Garmin Export',
    description: 'Garmin Connect CSV data export',
    icon: Watch,
    accept: '.csv,.fit',
    color: 'text-green-500',
  },
  {
    id: 'document',
    title: 'Documents',
    description: 'PDFs, lab reports, or clinical documents',
    icon: FileText,
    accept: '.pdf,.doc,.docx',
    color: 'text-gray-500',
  },
  {
    id: 'promethease',
    title: 'Promethease',
    description: 'Promethease genomic report file',
    icon: FlaskConical,
    accept: '.html,.zip',
    color: 'text-amber-500',
  },
];

export default function UploadPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Upload Hub"
        description="Import your health data from various sources"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {uploadTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="cursor-pointer transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg bg-gray-50 p-3 dark:bg-gray-800 ${type.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {type.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Accepts: {type.accept}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upload history */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Upload History
        </h2>
        <Card>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            No uploads yet. Select a data type above to get started.
          </p>
        </Card>
      </div>
    </div>
  );
}
