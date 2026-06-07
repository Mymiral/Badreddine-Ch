/**
 * Client-side video compressor using HTML5 Canvas & MediaRecorder API.
 * This runs entirely in the browser, using hardware acceleration via canvas where possible.
 */
export function compressVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If not a video, return as-is
    if (!file.type.startsWith('video/')) {
      return resolve(file);
    }

    // If already under 10MB, skip compression to save time and preserve original quality
    if (file.size <= 10 * 1024 * 1024) {
      onProgress?.(100);
      return resolve(file);
    }

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true; // Mute to avoid playing sound out loud to the user during compression
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    // Play fast to speed up compression (2x or 3x speed)
    video.playbackRate = 2.5;

    video.onloadedmetadata = () => {
      // Scale down to max 480p height to significantly reduce size while maintaining acceptable quality
      const targetHeight = 480;
      let width = video.videoWidth;
      let height = video.videoHeight;
      if (height > targetHeight) {
        width = Math.round((width * targetHeight) / height);
        // MediaRecorder requires even dimensions in many browsers
        if (width % 2 !== 0) width += 1;
        height = targetHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(video.src);
        return reject(new Error('Could not create rendering canvas context.'));
      }

      // Audio connection setup
      let audioTrack: MediaStreamTrack | null = null;
      let audioCtx: AudioContext | null = null;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        audioTrack = dest.stream.getAudioTracks()[0];
      } catch (err) {
        console.warn('Audio routing failed. Compression will proceed without audio:', err);
      }

      // Capture stream from canvas at 24fps
      const stream = canvas.captureStream(24);
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }

      // Pick supported format (webm/vp8 has best support for canvas capture and compression)
      let options = { mimeType: 'video/webm;codecs=vp8,opus', bitsPerSecond: 1200000 }; // ~1.2 Mbps
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm', bitsPerSecond: 1200000 };
      }

      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: 'video/webm' });
        
        // Clean up resources
        URL.revokeObjectURL(video.src);
        if (audioCtx) {
          audioCtx.close().catch(console.error);
        }

        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const compressedFile = new File([compressedBlob], `${nameWithoutExt}_compressed.webm`, {
          type: 'video/webm',
        });
        
        resolve(compressedFile);
      };

      let animationFrameId: number;
      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, width, height);

        // Report compression progress (0 - 100)
        const progress = Math.min(Math.round((video.currentTime / video.duration) * 100), 99);
        onProgress?.(progress);

        animationFrameId = requestAnimationFrame(drawFrame);
      };

      video.onplay = () => {
        drawFrame();
      };

      video.onended = () => {
        cancelAnimationFrame(animationFrameId);
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };

      // Start recording and playback
      recorder.start();
      video.play().catch((err) => {
        cancelAnimationFrame(animationFrameId);
        if (recorder.state !== 'inactive') recorder.stop();
        reject(err);
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata for compression.'));
    };
  });
}
