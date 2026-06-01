import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/supabase';
import { Trash2, CheckCircle, Clock, MapPin, Plus, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';

export default function MyListings() {
  const { user } = useAuth();
  const { language } = useApp();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la modification du statut');
    }
  };

  const labels = {
    fr: { title: 'Mes Annonces', empty: 'Vous n\'avez pas encore publié d\'annonce.', create: 'Publier un bien', status: 'Statut', actions: 'Actions', available: 'Disponible', sold: 'Vendu' },
    en: { title: 'My Listings', empty: 'You haven\'t published any listings yet.', create: 'Publish a property', status: 'Status', actions: 'Actions', available: 'Available', sold: 'Sold' },
    ar: { title: 'إعلاناتي', empty: 'لم تنشر أي إعلانات بعد.', create: 'نشر عقار', status: 'الحالة', actions: 'الإجراءات', available: 'متوفر', sold: 'تم البيع' }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  if (!user) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Veuillez vous connecter pour voir vos annonces.</h2>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">{l.title}</h1>
            <p className="text-muted-foreground">Gérez vos biens immobiliers sur DarLinkDz</p>
          </div>
          <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))} className="btn-luxury">
            <Plus className="h-4 w-4 mr-2" /> {l.create}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutGrid className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{l.empty}</h3>
            <p className="text-muted-foreground mb-8">Partagez votre bien avec des milliers d'acheteurs potentiels.</p>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))} variant="outline">
              Commencer maintenant
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all group">
                <div className="md:w-72 h-48 md:h-auto relative overflow-hidden">
                  <img 
                    src={listing.image || 'https://picsum.photos/seed/realestate/400/300'} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    listing.status === 'sold' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {listing.status === 'sold' ? l.sold : l.available}
                  </div>
                </div>
                
                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{listing.title}</h3>
                      <span className="text-xl font-bold text-primary">{listing.price}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleStatus(listing.id, listing.status || 'available')}
                        className={listing.status === 'sold' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-orange-600 border-orange-200 hover:bg-orange-50'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {listing.status === 'sold' ? 'Marquer comme disponible' : 'Marquer comme vendu'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
