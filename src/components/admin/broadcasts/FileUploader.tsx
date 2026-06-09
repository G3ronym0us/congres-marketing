'use client';

import { useState, useRef } from 'react';

/* ── design tokens ── */
const INK   = '#1A1418';
const PANEL = '#2A2228';
const NEON  = '#04EE62';
const LINE  = 'rgba(255,255,255,.08)';
const LINE2 = 'rgba(255,255,255,.14)';
const MUTE  = 'rgba(255,255,255,.45)';
const MUTE2 = 'rgba(255,255,255,.28)';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  maxFiles?: number;
}

export default function FileUploader({
  onFilesChange,
  maxSizeMB = 5,
  acceptedTypes = ['pdf', 'doc', 'docx', 'jpg', 'png', 'webp'],
  maxFiles = 3
}: FileUploaderProps) {
  const [files, setFiles]         = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError]         = useState('');
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeMB * 1024 * 1024)
      return `El archivo ${file.name} excede el máximo de ${maxSizeMB}MB`;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !acceptedTypes.includes(ext))
      return `Tipo no permitido: ${ext}. Permitidos: ${acceptedTypes.join(', ')}`;
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    if (files.length + fileArray.length > maxFiles) {
      setError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const err = validateFile(file);
      if (err) { setError(err); return; }
      if (files.some(f => f.name === file.name)) { setError(`"${file.name}" ya fue seleccionado`); return; }
      validFiles.push(file);
    }
    const updated = [...files, ...validFiles];
    setFiles(updated);
    onFilesChange(updated);
    setError('');
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'rgba(4,238,98,.5)' : LINE2}`,
          borderRadius: 12, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
          background: dragActive ? 'rgba(4,238,98,.04)' : 'transparent',
          transition: 'border-color .15s, background .15s',
        }}
        onMouseEnter={e => { if (!dragActive) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(4,238,98,.3)'; }}
        onMouseLeave={e => { if (!dragActive) (e.currentTarget as HTMLDivElement).style.borderColor = LINE2; }}
      >
        <input
          ref={fileInputRef} type="file" multiple style={{ display: 'none' }}
          accept={acceptedTypes.map(t => `.${t}`).join(',')}
          onChange={e => handleFiles(e.target.files)}
        />
        <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>📁</span>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4 }}>
          Haz clic o arrastra archivos aquí
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE2 }}>
          {acceptedTypes.join(', ').toUpperCase()} · máx. {maxSizeMB}MB · hasta {maxFiles} archivos
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: '#ff6b6b', marginTop: 8 }}>
          {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTE, marginBottom: 2 }}>
            Archivos seleccionados
          </div>
          {files.map((file, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: PANEL, border: `1px solid ${LINE2}`, borderRadius: 8, padding: '8px 12px' }}>
              <span style={{ fontSize: 16 }}>📎</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: MUTE }}>
                  {formatSize(file.size)}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); removeFile(i); }}
                style={{ background: 'rgba(255,80,80,.15)', border: '1px solid rgba(255,80,80,.25)', borderRadius: 6, color: '#ff6b6b', cursor: 'pointer', fontSize: 12, padding: '3px 8px', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
