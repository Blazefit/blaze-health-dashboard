'use client';

import { useRef, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Dna, Droplets, Activity, Watch, FileText, FlaskConical, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const uploadTypes = [
  {
    id: 'dna',
    title: 'AncestryDNA',
    description: 'Upload your raw DNA zip file for SNP analysis',
    icon: Dna,
    accept: '.zip',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    id: 'bloodwork_csv',
    title: 'Blood Work CSV',
    description: 'CSV from Rythm Health, Function Health, or generic lab format',
    icon: Droplets,
    accept: '.csv',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    id: 'cgm',
    title: 'CGM Export',
    description: 'FreeStyle Libre CSV glucose data export',
    icon: Activity,
    accept: '.csv',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'garmin',
    title: 'Garmin Export',
    description: 'Garmin Connect CSV data export',
    icon: Watch,
    accept: '.csv,.fit',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    id: 'document',
    title: 'Documents',
    description: 'PDFs, lab reports, or clinical documents',
    icon: FileText,
    accept: '.pdf,.doc,.docx',
    color: 'text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-800',
  },
  {
    id: 'promethease',
    title: 'Promethease',
    description: 'Promethease genomic report file',
    icon: FlaskConical,
    accept: '.html,.zip',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
];

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadResult {
  typeId: string;
  fileName: string;
  status: UploadStatus;
  message?: string;
}

export default function UploadPage() {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);

  const handleCardClick = (typeId: string) => {
    if (uploadingId) return; // prevent clicking while uploading
    fileInputRefs.current[typeId]?.click();
  };

  const handleFileSelect = async (typeId: string, file: File) => {
    setUploadingId(typeId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', typeId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        setResults((prev) => [
          { typeId, fileName: file.name, status: 'error', message: err.error || 'Upload failed' },
          ...prev,
        ]);
      } else {
        setResults((prev) => [
          { typeId, fileName: file.name, status: 'success', message: 'Uploaded successfully' },
          ...prev,
        ]);
      }
    } catch {
      setResults((prev) => [
        { typeId, fileName: file.name, status: 'error', message: 'Network error' },
        ...prev,
      ]);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Upload Hub"
        description="Import your health data from various sources"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {uploadTypes.map((type) => {
          const Icon = type.icon;
          const isUploading = uploadingId === type.id;
          return (
            <div key={type.id}>
              <input
                type="file"
                accept={type.accept}
                className="hidden"
                ref={(el) => { fileInputRefs.current[type.id] = el; }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(type.id, file);
                  e.target.value = ''; // reset so same file can be re-selected
                }}
              />
              <Card
                className={`cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-accent/30 ${
                  isUploading ? 'opacity-70 pointer-events-none' : ''
                }`}
                onClick={() => handleCardClick(type.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${type.bg} ${type.color}`}>
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {type.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {type.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Upload className="h-3.5 w-3.5 text-accent" />
                      <span className="text-xs font-medium text-accent">
                        {isUploading ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {type.accept}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Upload results */}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Upload Results
          </h2>
          <div className="space-y-2">
            {results.map((result, i) => (
              <Card key={`${result.typeId}-${result.fileName}-${i}`} className="!py-3">
                <div className="flex items-center gap-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {result.fileName}
                    </p>
                    <p className={`text-xs ${result.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {uploadTypes.find((t) => t.id === result.typeId)?.title}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Upload History
          </h2>
          <Card>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
              No uploads yet. Click a data type above to get started.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
