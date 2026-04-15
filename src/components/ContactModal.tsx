import React, { useState } from 'react';
import { Property } from '@/data/properties';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '@/contexts/AppContext';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ContactModalProps {
  property: Property;
  onClose: () => void;
}

export default function ContactModal({ property, onClose }: ContactModalProps) {
  const { language } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Je suis intéressé par le bien "${property.title}" à ${property.location}.`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const labels = {
    fr: { title: 'Contacter l\'agent', subtitle: 'Pour le bien', name: 'Nom complet', email: 'Email', message: 'Message', send: 'Envoyer la demande', success: 'Message envoyé avec succès !' },
    en: { title: 'Contact Agent', subtitle: 'For property', name: 'Full Name', email: 'Email', message: 'Message', send: 'Send Request', success: 'Message sent successfully!' },
    ar: { title: 'اتصل بالوكيل', subtitle: 'بخصوص العقار', name: 'الاسم الكامل', email: 'البريد الإلكتروني', message: 'الرسالة', send: 'إرسال الطلب', success: 'تم إرسال الرسالة بنجاح!' }
  };

  const l = labels[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        propertyId: property.id,
        propertyTitle: property.title,
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#050a1a]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0a1229] w-full max-w-lg rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-primary/5">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">{l.title}</h2>
            <p className="text-sm text-white/60">{l.subtitle}: <span className="text-white font-medium">{property.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{l.success}</h3>
          </div>
        ) : (
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">{l.name}</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">{l.email}</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">{l.message}</label>
              <textarea 
                rows={4} 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none resize-none transition-colors" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-luxury py-4 mt-4 flex items-center justify-center rounded-xl"
            >
              <Send className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '...' : l.send}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
