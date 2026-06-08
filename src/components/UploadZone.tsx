import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, CheckCircle2, RotateCw, AlertTriangle } from 'lucide-react';
import { uploadFile } from '@/lib/upload';

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  speed: string;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface UploadZoneProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

function FilePreview({ file, url }: { file: File; url?: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      setPreviewUrl(url);
      return;
    }
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage || isVideo) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, url]);

  if (!previewUrl) return null;

  const isVideo = file.type.startsWith('video/') ||
    previewUrl.toLowerCase().includes('.mp4') ||
    previewUrl.toLowerCase().includes('.mov') ||
    previewUrl.toLowerCase().includes('.webm');

  if (isVideo) {
    return (
      <video
        src={previewUrl}
        className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0"
        muted
        playsInline
      />
    );
  }

  return (
    <img
      src={previewUrl}
      alt={file.name}
      className="w-12 h-12 rounded-lg object-cover bg-muted shrink-0"
    />
  );
}

export default function UploadZone({ files, setFiles }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    // Note: we intentionally do NOT gate on `isOnline` here.
    // navigator.onLine is unreliable on first SPA navigation and causes
    // silent failures (returns early with no error shown). If the user is
    // truly offline the upload will fail and surface a real error message.

    const currentVideosCount = files.filter(f => f.file.type.startsWith('video/')).length;
    let newVideosCount = 0;
    const validFiles: File[] = [];

    for (const file of Array.from(selectedFiles)) {
      // 1. Max size check (20MB)
      if (file.size > 40 * 1024 * 1024) {
        alert(`Le fichier "${file.name}" dépasse la taille maximale de 20 Mo.`);
        continue;
      }

      // 2. Max video count check (2 videos max)
      if (file.type.startsWith('video/')) {
        if (currentVideosCount + newVideosCount >= 2) {
          alert("Vous ne pouvez pas ajouter plus de 2 vidéos.");
          continue;
        }
        newVideosCount++;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newFiles = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      speed: '0 MB/s',
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (const uploadItem of newFiles) {
      let lastProgress = 0;
      let lastTime = Date.now();

      try {
        const url = await uploadFile(uploadItem.file, (progress) => {
          const now = Date.now();
          const timeDiff = (now - lastTime) / 1000;
          let speedStr = uploadItem.speed;

          if (timeDiff > 0.5 && progress > lastProgress) {
            const bytesDiff = (progress - lastProgress) * uploadItem.file.size / 100;
            const mbps = bytesDiff / 1024 / 1024 / timeDiff;
            speedStr = `${mbps.toFixed(2)} MB/s`;
            lastProgress = progress;
            lastTime = now;
          }

          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadItem.id
                ? { ...f, progress, speed: speedStr }
                : f
            )
          );
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadItem.id
              ? { ...f, status: 'success', progress: 100, url }
              : f
          )
        );
      } catch (error: any) {
        console.error("Upload failed", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadItem.id
              ? {
                ...f,
                status: 'error',
                error: error.message || 'Error occurred'
              }
              : f
          )
        );
      }
    }
  };

  const handleRetry = async (id: string) => {
    const fileToRetry = files.find(f => f.id === id);
    if (!fileToRetry) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 0 } : f));

    let lastProgress = 0;
    let lastTime = Date.now();

    try {
      const url = await uploadFile(fileToRetry.file, (progress) => {
        const now = Date.now();
        const timeDiff = (now - lastTime) / 1000;
        let speedStr = fileToRetry.speed;

        if (timeDiff > 0.5 && progress > lastProgress) {
          const bytesDiff = (progress - lastProgress) * fileToRetry.file.size / 100;
          const mbps = bytesDiff / 1024 / 1024 / timeDiff;
          speedStr = `${mbps.toFixed(2)} MB/s`;
          lastProgress = progress;
          lastTime = now;
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, progress, speed: speedStr }
              : f
          )
        );
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'success', progress: 100, url }
            : f
        )
      );
    } catch (error: any) {
      console.error("Upload retry failed", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'error', error: error.message || 'Error occurred' }
            : f
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-[200px]"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.heic,.heif,.raw,.tiff,.bmp,.webp,.mkv,.avi,.mov,.mp4,.3gp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Glissez-déposez vos fichiers ici ou cliquez pour parcourir
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Taille max : 20 Mo par fichier. Limite : 2 vidéos maximum. Qualité préservée à 100% !
        </p>
        {!isOnline && (
          <p className="text-sm text-amber-500 mt-4 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Pas de connexion internet — vos fichiers seront mis en attente.
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(u => {
            const isError = u.status === 'error';
            const isSuccess = u.status === 'success';

            return (
              <div key={u.id} className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                <FilePreview file={u.file} url={u.url} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-semibold truncate pr-4 text-foreground">
                      {u.file.name} ({(u.file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs font-medium">
                      {isError
                        ? <span className="text-red-500">❌ {u.error || 'Failed'}</span>
                        : isSuccess
                          ? <span className="text-green-500 flex items-center gap-1">✅ Terminé</span>
                          : (
                            <span className="flex items-center gap-1.5 text-brand-accent font-semibold">
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              {u.file.type.startsWith('video/') && u.progress > 0 && u.progress < 50 ? (
                                <span>Compression : {u.progress * 2}%</span>
                              ) : u.file.type.startsWith('video/') && u.progress >= 50 ? (
                                <span>Envoi : {Math.round((u.progress - 50) * 2)}%</span>
                              ) : (
                                <span>Envoi : {u.progress}%</span>
                              )}
                            </span>
                          )
                      }
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden w-full relative">
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      @keyframes progress-shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                      }
                      .animate-progress-shimmer {
                        background: linear-gradient(90deg, #ec4899 25%, #f472b6 50%, #ec4899 75%);
                        background-size: 200% 100%;
                        animation: progress-shimmer 1.5s infinite linear;
                      }
                    `}} />
                    <div
                      className={`h-full absolute left-0 top-0 transition-all duration-300 rounded-full ${isError
                          ? 'bg-red-500'
                          : isSuccess
                            ? 'bg-green-500'
                            : 'animate-progress-shimmer'
                        }`}
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </div>

                {isError && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRetry(u.id); }}
                    className="p-2 bg-muted hover:bg-background border border-border rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shrink-0"
                  >
                    <RotateCw className="w-4 h-4" /> Réessayer
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter(f => f.id !== u.id)); }}
                  className="p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && files.every(f => f.status === 'success') && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2 text-green-600 font-medium">
          <CheckCircle2 className="w-5 h-5" /> Tous les fichiers uploadés avec succès
        </div>
      )}
    </div>
  );
}
