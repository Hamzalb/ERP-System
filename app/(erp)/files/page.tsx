'use client';
import { useState } from 'react';
import { Upload, FolderOpen, File, Image, FileText, Trash2, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatRelative } from '@/lib/utils';
import { toast } from 'sonner';

const FILES = [
  { _id: '1', name: 'Q1 Financial Report.pdf', mimetype: 'application/pdf', size: 245000, folder: '', uploadedBy: { name: 'Admin User' }, createdAt: '2026-06-01T10:00:00Z' },
  { _id: '2', name: 'Company Logo.png', mimetype: 'image/png', size: 85000, folder: '', uploadedBy: { name: 'Sarah Chen' }, createdAt: '2026-05-28T09:00:00Z' },
  { _id: '3', name: 'Employee Handbook.docx', mimetype: 'application/msword', size: 520000, folder: 'HR', uploadedBy: { name: 'John Doe' }, createdAt: '2026-05-20T14:00:00Z' },
  { _id: '4', name: 'Invoice Template.pdf', mimetype: 'application/pdf', size: 120000, folder: '', uploadedBy: { name: 'Admin User' }, createdAt: '2026-06-05T11:00:00Z' },
];

const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const getFileIcon = (mime: string) => {
  if (mime.startsWith('image/')) return Image;
  if (mime.includes('pdf')) return FileText;
  return File;
};

export default function FilesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">File Manager</h1>
          <p className="text-sm text-slate-500">{FILES.length} files</p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => toast.info('File picker would open here')}>Upload File</Button>
      </div>

      {/* Drop zone */}
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">Drop files here or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOC, XLS, PNG, JPG up to 10MB</p>
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FILES.map((file) => {
          const Icon = getFileIcon(file.mimetype);
          return (
            <div key={file._id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{formatRelative(file.createdAt)}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:text-indigo-600 hover:bg-indigo-50 rounded" onClick={() => toast.success('Download started')}><Download className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:text-red-500 hover:bg-red-50 rounded" onClick={() => toast.error('File deleted')}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
