import { supabase } from "@/supabase"
import { compressVideo } from "./videoCompressor"

export async function uploadFile(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  let fileToUpload = file;

  // Compress video if it is larger than 10MB
  if (file.type.startsWith('video/') && file.size > 10 * 1024 * 1024) {
    try {
      fileToUpload = await compressVideo(file, (compProgress) => {
        // Compression takes up 0% - 50% of the total progress bar
        const overallProgress = Math.round(compProgress * 0.5);
        onProgress?.(overallProgress);
      });
    } catch (compressErr) {
      console.warn("Client-side video compression failed, uploading original video instead:", compressErr);
      fileToUpload = file;
    }
  }

  const ext = fileToUpload.name.split('.').pop()
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `uploads/${uniqueName}`
  const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'test'

  // If compression happened, we start upload from 50% to 100%
  const isCompressed = fileToUpload !== file;

  // Use XMLHttpRequest for accurate upload progress tracking since fetch doesn't support it natively
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Key is missing from environment configuration");
  }

  // Retrieve current active user session token for RLS policies authorization
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token || supabaseAnonKey;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${filePath}`;
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    // Supabase storage REST API expects the raw file body with content-type
    xhr.setRequestHeader('Content-Type', fileToUpload.type || 'application/octet-stream');

    // Track real progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const uploadPercent = Math.round((event.loaded / event.total) * 100);
        if (isCompressed) {
          // Upload phase takes up 50% - 100% of the total progress bar
          const overallProgress = 50 + Math.round(uploadPercent * 0.5);
          onProgress?.(overallProgress);
        } else {
          // Standard upload takes 0% - 100%
          onProgress?.(uploadPercent);
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data: urlData } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath);
        if (urlData?.publicUrl) {
          resolve(urlData.publicUrl);
        } else {
          reject(new Error("Failed to retrieve public URL for uploaded file"));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.message || `Upload failed with status: ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during upload.'));
    };

    xhr.send(fileToUpload);
  });
}

