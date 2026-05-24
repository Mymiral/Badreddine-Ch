import { supabase } from "@/supabase"
import * as tus from "tus-js-client"

export async function uploadFile(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  const ext = file.name.split('.').pop()
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `uploads/${uniqueName}`

  // Ensure we have the supabase URL and anon key from env variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing')
  }

  const { data: { session } } = await supabase.auth.getSession()
  
  return new Promise((resolve, reject) => {
    // You must get the upload URL specific to the Supabase project
    const uploadUrl = `${supabaseUrl}/storage/v1/upload/resumable`

    const upload = new tus.Upload(file, {
      endpoint: uploadUrl,
      retryDelays: [0, 3000, 5000, 10000, 20000, 30000], // Retry up to 5 times with increasing delays
      headers: {
        authorization: `Bearer ${session?.access_token ?? supabaseKey}`,
        apikey: supabaseKey, // Add API key for Supabase
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Clean up local storage after success
      metadata: {
        bucketName: 'media',
        objectName: filePath,
        contentType: file.type || 'application/octet-stream',
        // 'cacheControl': '3600',
      },
      chunkSize: 6 * 1024 * 1024, // 6MB chunks
      onError: function (error) {
        console.error("Failed because: " + error)
        reject(error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100)
        onProgress?.(percentage)
      },
      onSuccess: function () {
        // Construct the public URL after successful upload
        const { data } = supabase.storage.from('media').getPublicUrl(filePath)
        resolve(data.publicUrl)
      },
    })

    upload.start()
  })
}
