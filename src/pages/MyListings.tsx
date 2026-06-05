import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Eye, MapPin, DollarSign, Home } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import { useApp } from '@/contexts/AppContext';

const MyListings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formatPrice } = useApp();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'properties'), where('agentId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(fetchedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load your listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'properties', id));
        setListings(listings.filter(listing => listing.id !== id));
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Failed to delete listing.');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your listings</h2>
          <Link to="/login" className="text-brand-accent hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      <div className="container-custom max-w-6xl">
        <BackButton />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{t('publish.myListings')}</h1>
            <p className="text-muted-foreground">Manage your published properties</p>
          </div>
          <Link
            to="/publish"
            className="flex items-center gap-2 bg-brand-accent text-brand-primary px-6 py-3 rounded-lg font-medium hover:bg-brand-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('nav.submitProperty')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">You haven't published any properties yet.</p>
            <Link
              to="/publish"
              className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary px-6 py-3 rounded-lg font-medium hover:bg-brand-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Publish your first property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      listing.type === 'sale' ? 'bg-brand-accent text-brand-primary' : 'bg-brand-secondary text-brand-white'
                    }`}>
                      {listing.type === 'sale' ? t('publish.sale') : t('publish.rent')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1" title={listing.title}>
                    {listing.title}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-brand-accent" />
                      <span className="truncate">{listing.location}, {listing.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-brand-accent" />
                      <span className="font-medium text-foreground">{formatPrice(listing.price)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Link
                      to={`/property/${listing.id}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand-accent transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t('common.view')}
                    </Link>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => alert('Edit functionality coming soon')}
                        className="p-2 text-muted-foreground hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title={t('common.edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
