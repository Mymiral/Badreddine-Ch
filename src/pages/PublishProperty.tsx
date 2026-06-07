import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Upload, Mic, MapPin, Home, DollarSign, CheckCircle2, X, StopCircle, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LocationSelector from '@/components/LocationSelector';
import BackButton from '@/components/BackButton';
import { MapPicker } from '@/components/MapPicker';
import UploadZone, { UploadedFile } from '@/components/UploadZone';
import { supabase } from '@/supabase';
import { uploadFile } from '@/lib/upload';

const PublishProperty = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'sale',
    propertyType: 'apartment',
    price: '',
    description: '',
    location: '',
    address: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    video: '',
    audio: '',
    features: [] as string[],
  });

  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editId || !user) return;

    const fetchPropertyForEdit = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;

        if (data) {
          // Verify ownership
          if (data.agent_id !== user.uid) {
            setError("You don't have permission to edit this property.");
            return;
          }

          setFormData({
            title: data.title || '',
            type: data.type || 'sale',
            propertyType: data.property_type || 'apartment',
            price: String(data.price || ''),
            description: data.description || '',
            location: data.location || '',
            address: data.address || '',
            city: data.city || '',
            bedrooms: String(data.bedrooms || ''),
            bathrooms: String(data.bathrooms || ''),
            area: String(data.area || ''),
            video: data.video || '',
            audio: data.audio || '',
            features: data.features || [],
          });

          if (data.lat && data.lng) {
            setMapPosition({ lat: Number(data.lat), lng: Number(data.lng) });
          }

          // Populate uploads with existing images
          if (data.images && Array.isArray(data.images)) {
            const existingFiles = data.images.map((url: string, index: number) => {
              const filename = url.split('/').pop() || `image_${index}`;
              const dummyFile = new File([], filename);
              return {
                id: `existing_${index}_${Date.now()}`,
                file: dummyFile,
                progress: 100,
                speed: '',
                status: 'success' as const,
                url: url
              };
            });
            setUploads(existingFiles);
          }
        }
      } catch (err: any) {
        console.error('Error fetching property for edit:', err);
        setError(`Failed to load property data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyForEdit();
  }, [editId, user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setRecordingTime(0);
      
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
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to publish a property.');
      return;
    }

    if (uploads.length > 0 && !uploads.every(u => u.status === 'success')) {
      setError('Please wait for all uploads to finish before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Collect URLs (images vs video)
      const mediaUrls: string[] = [];
      let videoUrl: string | null = null;
      
      uploads.forEach(u => {
        if (u.url) {
          if (u.file.type.startsWith('video/')) {
            videoUrl = u.url;
          } else {
            mediaUrls.push(u.url);
          }
        }
      });

      let uploadedAudioUrl = '';
      if (formData.audio && formData.audio.startsWith('data:')) {
        const response = await fetch(formData.audio);
        const blob = await response.blob();
        const file = new File([blob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        uploadedAudioUrl = await uploadFile(file);
      } else {
        uploadedAudioUrl = formData.audio;
      }
      // 2. Save Announcement to Supabase properties table
      const dbQuery = editId 
        ? supabase
            .from('properties')
            .update({
              title: formData.title,
              description: formData.description,
              type: formData.type,
              property_type: formData.propertyType,
              price: Number(formData.price),
              area: Number(formData.area),
              bedrooms: Number(formData.bedrooms),
              bathrooms: Number(formData.bathrooms),
              city: formData.city,
              location: formData.location,
              address: formData.address,
              lat: mapPosition?.lat || null,
              lng: mapPosition?.lng || null,
              images: mediaUrls,
              video: videoUrl || formData.video,
              audio: uploadedAudioUrl,
              status: 'available'
            })
            .eq('id', editId)
        : supabase
            .from('properties')
            .insert([{
              title: formData.title,
              description: formData.description,
              type: formData.type,
              property_type: formData.propertyType,
              price: Number(formData.price),
              area: Number(formData.area),
              bedrooms: Number(formData.bedrooms),
              bathrooms: Number(formData.bathrooms),
              city: formData.city,
              location: formData.location,
              address: formData.address,
              lat: mapPosition?.lat || null,
              lng: mapPosition?.lng || null,
              images: mediaUrls,
              video: videoUrl || formData.video,
              audio: uploadedAudioUrl,
              agent_id: user.uid,
              featured: false,
              status: 'available'
            }]);

      const { data: supaData, error: supaError } = await dbQuery.select().single();
      
      if (supaError) {
        console.error("Supabase Save Error:", supaError);
        throw new Error(supaError.message || JSON.stringify(supaError));
      }

      // Smart Alert Matching Logic in Supabase
      try {
        const { data: alertsData } = await supabase
          .from('alerts')
          .select('*')
          .eq('active', true);

        if (alertsData) {
          for (const alert of alertsData) {
            const matchType = !alert.type || alert.type === 'Tous' || alert.type.toLowerCase() === formData.propertyType.toLowerCase();
            const matchWilaya = !alert.location || alert.location === 'Tous' || alert.location === formData.city;
            // Compare budget string or convert it if it has range/number
            const maxBudget = parseFloat(alert.budget || '0');
            const matchBudget = !maxBudget || Number(formData.price) <= maxBudget;
            
            if (matchType && matchWilaya && matchBudget) {
              await supabase.from('notifications').insert([{
                uid: alert.uid,
                title: 'Nouveau bien assorti !',
                content: `Le bien "${formData.title}" correspond à vos alertes.`,
                read: false
              }]);
            }
          }
        }
      } catch (alertErr) {
        console.error('Error processing alerts:', alertErr);
      }

      setSuccess(true);
      window.dispatchEvent(new CustomEvent('property-created'));
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (err: any) {
      console.error('Error publishing property:', err);
      setError(`Database Error: ${err.message || 'Failed to publish property.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border p-8 rounded-2xl shadow-lg text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{editId ? t('publish.editSuccess', 'Annonce modifiée avec succès !') : t('publish.success')}</h2>
          <p className="text-muted-foreground mb-6">Redirecting to your listings...</p>
        </motion.div>
      </div>
    );
  }

  const isUploading = uploads.some(u => u.status === 'uploading');
  const uploadedCount = uploads.filter(u => u.status === 'success').length;
  const totalUploads = uploads.length;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-4xl">
        <BackButton />
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {editId ? t('publish.editTitle', "Modifier l'annonce") : t('publish.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {editId ? t('publish.editSubtitle', "Modifiez les détails de votre propriété") : t('publish.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Info Section */}
          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Home className="w-6 h-6 text-brand-accent" />
              {t('publish.basicInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">{t('publish.propertyTitle')} *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                  placeholder={t('listing_title_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.transactionType')} *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.type === 'sale' ? 'border-brand-accent bg-brand-accent/10 text-brand-primary font-medium' : 'border-border hover:bg-muted'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="sale"
                      checked={formData.type === 'sale'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {t('publish.sale')}
                  </label>
                  <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.type === 'rent' ? 'border-brand-secondary bg-brand-secondary/10 text-brand-white font-medium' : 'border-border hover:bg-muted'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="rent"
                      checked={formData.type === 'rent'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {t('publish.rent')}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.propertyType')} *</label>
                <select
                  name="propertyType"
                  required
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all appearance-none"
                >
                  <option value="apartment">{t('apartment')}</option>
                  <option value="villa">{t('villa')}</option>
                  <option value="studio">{t('hero.search.studio')}</option>
                  <option value="land">{t('land')}</option>
                  <option value="office">{t('hero.search.office')}</option>
                  <option value="commercial">{t('office')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.price')} (DZD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    placeholder={t('price_placeholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.area')} *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="area"
                    required
                    min="0"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                    placeholder={t('surface_placeholder')}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">m²</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">{t('publish.description')} *</label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all resize-none"
                  placeholder={t('description_placeholder')}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-brand-accent" />
              {t('publish.location')}
            </h2>
            <div className="space-y-6">
              <LocationSelector 
                initialWilaya={formData.city}
                initialCommune={formData.location}
                onLocationChange={({ wilaya, commune }) => {
                  setFormData(prev => ({
                    ...prev,
                    city: wilaya,
                    location: commune
                  }));
                }}
              />
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">{t('publish.mapPosition', 'Position sur la carte (Optionnel)')}</h3>
                <MapPicker position={mapPosition} onChange={setMapPosition} />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">{t('publish.address')}</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                  placeholder={t('address_placeholder')}
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-brand-accent" />
              {t('publish.features')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.bedrooms')} *</label>
                <input
                  type="number"
                  name="bedrooms"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                  placeholder={t('bedrooms_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.bathrooms')} *</label>
                <input
                  type="number"
                  name="bathrooms"
                  required
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
                  placeholder={t('bathrooms_placeholder')}
                />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-brand-accent" />
              {t('publish.media')}
            </h2>
                        <div className="space-y-6">
              <UploadZone files={uploads} setFiles={setUploads} />

              <div className="space-y-2 pt-6 border-t border-border">
                <label className="text-sm font-medium flex items-center mb-2">
                  <Video className="w-4 h-4 mr-2 text-brand-accent" /> {t('publish.videoUrl', 'Lien Vidéo (YouTube, etc.)')}
                </label>
                <input 
                  type="url" 
                  name="video"
                  placeholder={t('video_url_placeholder', 'https://youtube.com/...')} 
                  value={formData.video}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all" 
                />
              </div>

              {/* Audio */}
              <div className="space-y-2 pt-6 border-t border-border">
                <label className="text-sm font-medium flex items-center">
                  <Mic className="w-4 h-4 mr-2 text-brand-accent" /> {t('publish.voiceNote')}
                </label>
                {formData.audio ? (
                  <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border">
                    <audio src={formData.audio} controls className="h-10 flex-1" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, audio: ''})} 
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                        isRecording 
                          ? 'bg-red-500/10 border-red-500 text-red-500' 
                          : 'border-border hover:bg-muted text-foreground'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="font-mono">{formatTime(recordingTime)}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <StopCircle className="w-5 h-5" /> Arrêter l'enregistrement
                        </>
                      ) : (
                        <><Mic className="w-5 h-5 text-brand-accent" /> {t('publish.recordVoice')}</>
                      )}
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Ajoutez une description vocale pour plus d'impact (Optionnel)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
            >
              {t('publish.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-brand-accent text-brand-primary font-bold hover:bg-brand-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  {isUploading ? `${uploadedCount}/${totalUploads} fichiers uploadés` : editId ? 'Enregistrement...' : 'Publication...'}
                </>
              ) : (
                editId ? t('publish.saveChanges', 'Enregistrer les modifications') : t('publish.publish')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishProperty;
