import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface AudioDescriptionProps {
  text: string;
  url?: string;
}

export default function AudioDescription({ text, url }: AudioDescriptionProps) {
  const { language } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    setSynth(window.speechSynthesis);
    if (url) {
      const a = new Audio(url);
      a.onended = () => setIsPlaying(false);
      setAudio(a);
    }
    return () => {
      window.speechSynthesis.cancel();
      if (audio) {
        audio.pause();
      }
    };
  }, [url]);

  const toggleAudio = () => {
    if (url && audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    if (!synth) return;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for TTS
    const voices = synth.getVoices();
    const langMap: Record<string, string> = {
      fr: 'fr-FR',
      en: 'en-US',
      ar: 'ar-SA'
    };
    
    utterance.lang = langMap[language] || 'en-US';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const labels = {
    fr: 'Description audio',
    en: 'Audio description',
    ar: 'وصف صوتي'
  };

  const isActive = isSpeaking || isPlaying;

  return (
    <button
      onClick={toggleAudio}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${isActive ? 'bg-primary text-white' : 'bg-primary/10 hover:bg-primary/20 text-primary'}`}
    >
      {isActive ? (
        isPlaying ? <Pause className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span>{labels[language as keyof typeof labels]}</span>
    </button>
  );
}
