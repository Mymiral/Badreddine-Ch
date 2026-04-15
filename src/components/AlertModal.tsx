import React, { useState } from 'react';
import { X, Bell, CheckCircle2, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '@/contexts/AppContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { db, loginWithGoogle, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AlertModalProps {
  onClose: () => void;
}

export default function AlertModal({ onClose }: AlertModalProps) {
  const { language } = useApp();
  const { user } = useFirebase();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Villa',
    location: '',
    budget: '',
    email: user?.email || '',
    phone: '',
    channels: ['email'] as string[]
  });

  const labels = {
    fr: { title: 'Créer une alerte', subtitle: 'Soyez informé des nouveaux biens', type: 'Type de bien', budget: 'Budget max', email: 'Votre email', phone: 'Téléphone', location: 'Localisation', submit: 'Activer l\'alerte', success: 'Alerte activée !', login: 'Se connecter pour créer une alerte' },
    en: { title: 'Create Alert', subtitle: 'Get notified of new properties', type: 'Property Type', budget: 'Max Budget', email: 'Your email', phone: 'Phone', location: 'Location', submit: 'Activate Alert', success: 'Alert activated!', login: 'Login to create an alert' },
    ar: { title: 'إنشاء تنبيه', subtitle: 'احصل على إشعارات بالعقارات الجديدة', type: 'نوع العقار', budget: 'الميزانية القصوى', email: 'بريدك الإلكتروني', phone: 'الهاتف', location: 'الموقع', submit: 'تفعيل التنبيه', success: 'تم تفعيل التنبيه!', login: 'سجل الدخول لإنشاء تنبيه' }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const path = 'alerts';
      await addDoc(collection(db, path), {
        ...formData,
        uid: user.uid,
        active: true,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'alerts');
    } finally {
      setLoading(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-12 text-center animate-in zoom-in-95 duration-300">
          <LogIn className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold mb-4">{l.login}</h2>
          <Button onClick={loginWithGoogle} className="w-full btn-luxury py-6">
            <LogIn className="h-4 w-4 mr-2" />
            Google Login
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-12 text-center animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-2">{l.success}</h2>
          <p className="text-muted-foreground mb-8">Vous recevrez une notification dès qu'un bien correspondant sera publié.</p>
          <Button onClick={onClose} className="w-full">Fermer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center bg-primary/5">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">{l.title}</h2>
              <p className="text-sm text-muted-foreground">{l.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{l.type}</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none"
              >
                <option>Villa</option>
                <option>Appartement</option>
                <option>Penthouse</option>
                <option>Terrain</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{l.location}</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Alger, Oran..." 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{l.budget}</label>
              <input 
                type="text" 
                required
                placeholder="Ex: 200,000,000 DZD" 
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{l.phone}</label>
              <input 
                type="tel" 
                required
                placeholder="05XX XX XX XX" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{l.email}</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Canaux de notification</label>
            <div className="flex flex-wrap gap-2">
              {['email', 'whatsapp', 'telegram'].map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => toggleChannel(channel)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    formData.channels.includes(channel)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {channel.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full btn-luxury py-6">
            <Bell className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '...' : l.submit}
          </Button>
        </form>
      </div>
    </div>
  );
}
