import { supabase } from "@/supabase"

export async function uploadFile(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop()
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `uploads/${uniqueName}`
  const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'test'

  // Standard upload using Supabase client to avoid resumable TUS upload RLS issues
  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: (progress) => {
        if (progress.total) {
          const percentage = Math.round((progress.loaded / progress.total) * 100)
          onProgress?.(percentage)
        }
      }
    })

  if (error) {
    console.error("Supabase upload error:", error)
    throw error
  }

  const { data: urlData } = supabase.storage.from(supabaseBucket).getPublicUrl(filePath)
  return urlData.publicUrl
}

