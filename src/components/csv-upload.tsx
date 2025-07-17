"use client";

import * as React from 'react';
import { Upload, Loader2, FileCheck2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type CsvUploadProps = {
  onSubmit: (file: File) => void;
  isLoading: boolean;
};

export function CsvUpload({ onSubmit, isLoading }: CsvUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      onSubmit(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
          <Link href="/sample-transactions.csv" className="flex items-center text-xs text-muted-foreground hover:text-primary" download>
              <Download className="mr-1 h-3 w-3" />
              Download Sample CSV
          </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv, text/csv"
          className="hidden"
          id="csv-upload"
        />
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {file ? <FileCheck2 className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
          <span className="truncate">
            {file ? file.name : 'Choose a CSV file'}
          </span>
        </Button>

        <Button type="submit" disabled={isLoading || !file} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Upload & Predict
        </Button>
      </form>
    </div>
  );
}
