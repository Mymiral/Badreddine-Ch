import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Upload, Mic, MapPin, Home, DollarSign, CheckCircle2, X, Video, StopCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import LocationSelector from '@/components/LocationSelector';
import BackButton from '@/components/BackButton';
import { MapPicker } from '@/components/MapPicker';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  speed: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  retryCount: number;
  task?: UploadTask;
  type: 'image' | 'video';
}

const PublishProperty = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk

  const uploadInChunks = async (file: File, type: 'image' | 'video'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);
      const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      
      let retryCount = 0;
      
      const doUpload = () => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        setUploads(prev => {
          const existing = prev.find(u => u.id === id);
          if (existing) {
            return prev.map(u => u.id === id ? { ...u, status: 'uploading', retryCount, task: uploadTask } : u);
          }
          return [...prev, { id, file, progress: 0, speed: 0, status: 'uploading', retryCount, task: uploadTask, type }];
        });

        let lastBytesTransferred = 0;
        let lastTime = Date.now();

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const now = Date.now();
            const timeDiff = (now - lastTime) / 1000;
            let speed = 0;
            if (timeDiff > 0.5) {
              speed = ((snapshot.bytesTransferred - lastBytesTransferred) / 1024) / timeDiff;
              lastBytesTransferred = snapshot.bytesTransferred;
              lastTime = now;
            }

            setUploads(prev => prev.map(u => u.id === id ? { ...u, progress, speed: speed > 0 ? speed : u.speed } : u));
          },
          (error) => {
            if (retryCount < 5) {
              retryCount++;
              setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error', retryCount } : u));
              setTimeout(() => {
                doUpload();
              }, 3000);
            } else {
              setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error' } : u));
              reject(error);
            }
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: 100, status: 'success', url } : u));
            resolve(url);
          }
        );
      };
      
      doUpload();
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[];
      const validFiles: File[] = [];
      
      setUploadError(null);
      
      for (const file of selectedFiles) {
        if (file.size > 15 * 1024 * 1024) {
          setUploadError(`Fichier trop lourd — max 15MB pour les photos: ${file.name}`);
        } else {
          validFiles.push(file);
        }
      }

      await Promise.all(validFiles.map(file => uploadInChunks(file, 'image')));
    }
  };

  const removeImage = (index: number) => {
    setUploads(prev => {
      const imageUploads = prev.filter(u => u.type === 'image');
      const targetUpload = imageUploads[index];
      if (targetUpload && targetUpload.task) {
        targetUpload.task.cancel();
      }
      return prev.filter(u => u.id !== targetUpload?.id);
    });
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadError(null);
      if (file.size > 500 * 1024 * 1024) {
        setUploadError('Fichier trop lourd — max 500MB pour les vidéos');
        return;
      }
      await uploadInChunks(file, 'video');
    }
  };

  const removeVideo = () => {
    setUploads(prev => {
      const videoUploads = prev.filter(u => u.type === 'video');
      videoUploads.forEach(u => {
        if (u.task) u.task.cancel();
      });
      return prev.filter(u => u.type !== 'video');
    });
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

    setLoading(true);
    setError(null);

    try {
      let uploadedImageUrls: string[] = [];
      let uploadedVideoUrl: string = formData.video;

      uploadedImageUrls = uploads.filter(u => u.type === 'image' && u.status === 'success' && u.url).map(u => u.url!);
      const videoUpload = uploads.find(u => u.type === 'video' && u.status === 'success' && u.url);
      if (videoUpload) uploadedVideoUrl = videoUpload.url!;

      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        video: uploadedVideoUrl,
        audio: formData.audio,
        images: uploadedImageUrls,
        agentId: user.uid,
        agentName: user.displayName || user.email?.split('@')[0] || 'Agent',
        featured: false,
        createdAt: serverTimestamp(),
        lat: mapPosition?.lat || null,
        lng: mapPosition?.lng || null,
      };

      await addDoc(collection(db, 'properties'), propertyData);

      // Also try saving to Supabase if configured
      try {
        // Dynamic import of supabase client to avoid issues if not configured globally
        const { supabase } = await import('@/supabase');
        const { error: supabaseError } = await supabase
          .from('properties')
          .insert([{
            title: propertyData.title,
            type: propertyData.type,
            property_type: propertyData.propertyType,
            price: propertyData.price,
            location: propertyData.location,
            address: propertyData.address,
            city: propertyData.city,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            area: propertyData.area,
            images: propertyData.images,
            video: propertyData.video,
            audio: propertyData.audio,
            description: propertyData.description,
            featured: propertyData.featured,
            lat: propertyData.lat,
            lng: propertyData.lng,
            agent_id: propertyData.agentId,
            status: 'available',
            created_at: new Date().toISOString()
          }]);
        
        if (supabaseError) console.error('Supabase save error:', supabaseError.message);
      } catch (supaErr) {
        console.error('Supabase integration error:', supaErr);
      }
      
      // Smart Alert Matching Logic
      try {
        const alertsSnapshot = await getDocs(query(collection(db, 'alerts'), where('is_active', '==', true)));
        
        alertsSnapshot.forEach(async (alertDoc) => {
          const alert = alertDoc.data();
          
          // Check matching criteria
          const matchType = alert.propertyType === 'Tous' || alert.propertyType.toLowerCase() === propertyData.propertyType.toLowerCase();
          const matchTransaction = alert.transaction === 'Tous' || alert.transaction.toLowerCase() === (propertyData.type === 'sale' ? 'vente' : 'location');
          const matchWilaya = alert.wilaya === 'Tous' || alert.wilaya === propertyData.city;
          const matchBudget = !alert.budget || propertyData.price <= alert.budget;
          
          if (matchType && matchTransaction && matchWilaya && matchBudget) {
            // Create notification
            await addDoc(collection(db, 'notifications'), {
              alertId: alertDoc.id,
              phone: alert.phone,
              propertyTitle: propertyData.title,
              isRead: false,
              createdAt: serverTimestamp()
            });
          }
        });
      } catch (alertErr) {
        console.error('Error processing alerts:', alertErr);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (err) {
      console.error('Error publishing property:', err);
      setError('Failed to publish property. Please try again.');
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
          <h2 className="text-2xl font-bold mb-2">{t('publish.success')}</h2>
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
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('publish.title')}</h1>
          <p className="text-muted-foreground text-lg">{t('publish.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8 border border-red-200 dark:border-red-900/50">
            {uploadError}
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
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('publish.images')} *</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('publish.dragImages', 'Glissez-déposez vos images ici ou cliquez pour parcourir')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('publish.imageFormats', 'JPG, PNG, WEBP (Max 5MB par image)')}
                  </p>
                </div>
              </div>

              {/* Image Previews */}
              {uploads.filter(u => u.type === 'image').length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploads.filter(u => u.type === 'image').map((u, index) => (
                    <div key={u.id} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                      <img src={u.url || URL.createObjectURL(u.file)} alt={`Preview ${index}`} className="w-full h-full object-cover opacity-50" />
                      {u.status === 'success' && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-green-500" /></div>}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-6 border-t border-border">
                <label className="text-sm font-medium flex items-center">
                  <Video className="w-4 h-4 mr-2 text-brand-accent" /> {t('publish.addVideo', 'Ajouter une vidéo (Max 100MB)')}
                </label>
                
                {uploads.filter(u => u.type === 'video').length === 0 ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo"
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Video className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('publish.dragVideo', 'Cliquez ou glissez une vidéo ici')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('publish.videoFormats', 'MP4, MOV, AVI (Max 100MB)')}
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border bg-black aspect-video">
                    <video src={uploads.find(u => u.type === 'video')?.url || URL.createObjectURL(uploads.find(u => u.type === 'video')!.file)} controls className="w-full h-full object-contain opacity-50" />
                    {uploads.find(u => u.type === 'video')?.status === 'success' && <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none"><CheckCircle2 className="w-12 h-12 text-green-500" /></div>}
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <div className="mt-4">
                  <label className="text-sm font-medium flex items-center mb-2">
                    {t('publish.videoUrl', 'Ou URL de la vidéo (YouTube, etc.)')}
                  </label>
                  <input 
                    type="url" 
                    name="video"
                    placeholder={t('video_url_placeholder')} 
                    value={formData.video}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all" 
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploads.length > 0 && (
                <div className="space-y-3 mt-4">
                  {uploads.map(u => (
                    <div key={u.id} className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium truncate max-w-[200px]">{u.file.name}</span>
                          <span className="text-muted-foreground">
                            {u.status === 'error' && u.retryCount < 5 
                              ? `Connexion lente — nouvelle tentative (${u.retryCount}/5)...` 
                              : u.status === 'error' 
                                ? 'Échec' 
                                : `${Math.round(u.progress)}% - ${Math.round(u.speed)} KB/s`}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${u.status === 'error' ? 'bg-red-500' : u.status === 'success' ? 'bg-green-500' : 'bg-brand-accent'}`}
                            style={{ width: `${u.progress}%` }}
                          />
                        </div>
                      </div>
                      {u.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}

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
                  {isUploading ? `${uploadedCount}/${totalUploads} fichiers uploadés` : 'Publication...'}
                </>
              ) : (
                t('publish.publish')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishProperty;
