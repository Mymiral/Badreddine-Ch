import React, { useState, useRef } from 'react';
import { X, Plus, Image as ImageIcon, Video, Mic, MapPin, DollarSign, Bed, Bath, Maximize, Send, Trash2, StopCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/lib/upload';
import { supabase } from '@/supabase';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface CreatePropertyModalProps {
  onClose: () => void;
}

export default function CreatePropertyModal({ onClose }: CreatePropertyModalProps) {
  const { language } = useApp();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Villa' as 'sale' | 'rent', // This should probably be the transaction type, but 'type' in form seems to be property type
    propertyType: 'Villa',
    price: 0,
    location: '',
    address: '',
    city: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    description: '',
    images: [] as string[],
    video: '',
    audio: '',
    status: 'available',
    lat: 36.7538,
    lng: 3.0588
  });

  const labels = {
    fr: { title: 'Nouvelle annonce', subtitle: 'Publiez votre bien sur DarLinkDz', submit: 'Publier', cancel: 'Annuler', success: 'Annonce publiée !', addImage: 'Ajouter des images', recordAudio: 'Enregistrer un commentaire', stopAudio: 'Arrêter l\'enregistrement', videoUrl: 'URL de la vidéo (YouTube, etc.)' },
    en: { title: 'New Announcement', subtitle: 'Publish your property on DarLinkDz', submit: 'Publish', cancel: 'Cancel', success: 'Announcement published!', addImage: 'Add images', recordAudio: 'Record commentary', stopAudio: 'Stop recording', videoUrl: 'Video URL (YouTube, etc.)' },
    ar: { title: 'إعلان جديد', subtitle: 'انشر عقارك على DarLinkDz', submit: 'نشر', cancel: 'إلغاء', success: 'تم نشر الإعلان!', addImage: 'إضافة صور', recordAudio: 'تسجيل تعليق', stopAudio: 'إيقاف التسجيل', videoUrl: 'رابط الفيديو (يوتيوب، إلخ)' },
    tzm: { title: 'Isalan imaynuten', subtitle: 'Ssekfel ayla-nk di DarLinkDz', submit: 'Ssekfel', cancel: 'Semmet', success: 'Ayla i-ssekfel!', addImage: 'Rnu tiwlafin', recordAudio: 'Ssekles ameslay', stopAudio: 'Hbes assekles', videoUrl: 'Tamselyat n uvidyu (YouTube, atg.)' }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const validImages = formData.images.filter(img => img.trim() !== '');
      
      const uploadPromises = validImages.map(async (dataUrl, index) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `image_${index}.jpg`, { type: 'image/jpeg' });
        return uploadFile(file);
      });
      
      const uploadedImageUrls = await Promise.all(uploadPromises);

      let uploadedAudioUrl = '';
      if (formData.audio && formData.audio.startsWith('data:')) {
        const response = await fetch(formData.audio);
        const blob = await response.blob();
        const file = new File([blob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        uploadedAudioUrl = await uploadFile(file);
      } else {
        uploadedAudioUrl = formData.audio;
      }
      
      const { error: supabaseError } = await supabase
        .from('properties')
        .insert([{
          title: formData.title,
          type: formData.type,
          property_type: formData.propertyType,
          price: Number(formData.price),
          location: formData.location,
          address: formData.address,
          city: formData.city,
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          area: Number(formData.area),
          description: formData.description,
          images: uploadedImageUrls,
          image: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : '',
          video: formData.video,
          audio: uploadedAudioUrl,
          agent_id: user.uid,
          featured: false,
          status: 'available'
        }]);

      if (supabaseError) throw supabaseError;

      onClose();
      window.dispatchEvent(new CustomEvent('property-created'));
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('Error creating property: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files as FileList).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, audio: reader.result as string }));
        };
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-[#050a1a]/80 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-[#0a1229] w-full max-w-2xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden max-h-[85vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-primary/5">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">{l.title}</h2>
              <p className="text-sm text-white/60">{l.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-6 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">{t('listing_title')}</label>
              <input 
                type="text" 
                required
                placeholder={t('listing_title_placeholder')} 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">{t('property_type')}</label>
              <select 
                value={formData.propertyType}
                onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors appearance-none"
              >
                <option className="bg-[#0a1229]" value="Villa">{t('villa')}</option>
                <option className="bg-[#0a1229]" value="Appartement">{t('apartment')}</option>
                <option className="bg-[#0a1229]" value="Penthouse">Penthouse</option>
                <option className="bg-[#0a1229]" value="Terrain">{t('land')}</option>
                <option className="bg-[#0a1229]" value="Local Commercial">{t('office')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Transaction</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'sale' | 'rent'})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors appearance-none"
              >
                <option className="bg-[#0a1229]" value="sale">{t('properties.sale')}</option>
                <option className="bg-[#0a1229]" value="rent">{t('properties.rent')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-white/90">
                <DollarSign className="h-4 w-4 mr-1 text-primary" /> {t('price')} (DZD)
              </label>
              <input 
                type="number" 
                required
                placeholder={t('price_placeholder')} 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-1 text-primary" /> {t('publish.location')}
              </label>
              <input 
                type="text" 
                required
                placeholder={t('address_placeholder')} 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Ville / Commune</label>
              <input 
                type="text" 
                placeholder="Ex: Alger, Oran..." 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-white/90">
                <Bed className="h-4 w-4 mr-1 text-primary" /> {t('publish.bedrooms')}
              </label>
              <input 
                type="number" 
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-white/90">
                <Bath className="h-4 w-4 mr-1 text-primary" /> {t('publish.bathrooms')}
              </label>
              <input 
                type="number" 
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-white/90">
                <Maximize className="h-4 w-4 mr-1 text-primary" /> {t('surface')}
              </label>
              <input 
                type="number" 
                required
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">{t('description')}</label>
            <textarea 
              rows={4}
              required
              placeholder={t('description_placeholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Media Section */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            
            {/* Images */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center text-white/90">
                <ImageIcon className="h-4 w-4 mr-2 text-primary" /> Images
              </label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group">
                    <img src={img} alt="upload" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Plus className="h-6 w-6 text-white/50 mb-1" />
                  <span className="text-[10px] text-white/50 text-center px-1">{l.addImage}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            {/* Video */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center text-white/90">
                <Video className="h-4 w-4 mr-2 text-primary" /> {l.videoUrl}
              </label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={formData.video}
                onChange={(e) => setFormData({...formData, video: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors" 
              />
            </div>

            {/* Audio */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center text-white/90">
                <Mic className="h-4 w-4 mr-2 text-primary" /> Commentaire Audio
              </label>
              {formData.audio ? (
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                  <audio src={formData.audio} controls className="h-8 flex-1" />
                  <button type="button" onClick={() => setFormData({...formData, audio: ''})} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center justify-center w-full py-4 rounded-lg border transition-all ${isRecording ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white/80 hover:border-primary hover:text-primary'}`}
                >
                  {isRecording ? (
                    <><StopCircle className="h-5 w-5 mr-2" /> {l.stopAudio}</>
                  ) : (
                    <><Mic className="h-5 w-5 mr-2" /> {l.recordAudio}</>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 rounded-xl font-bold border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              {l.cancel}
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 btn-luxury py-4 flex items-center justify-center rounded-xl"
            >
              <Send className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '...' : l.submit}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
