import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Search, Bell, Trash2, Power, PowerOff, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { db, loginWithGoogle, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function MyAlerts() {
  const { language } = useApp();
  const { user } = useFirebase();
  const [searchPhone, setSearchPhone] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const labels = {
    fr: { title: 'Mes alertes', subtitle: 'Gérez vos alertes immobilières', search: 'Rechercher par téléphone', placeholder: 'Ex: 05XX XX XX XX', noAlerts: 'Aucune alerte trouvée.', active: 'Active', inactive: 'Inactive', login: 'Connectez-vous pour voir vos alertes' },
    en: { title: 'My Alerts', subtitle: 'Manage your property alerts', search: 'Search by phone', placeholder: 'Ex: 05XX XX XX XX', noAlerts: 'No alerts found.', active: 'Active', inactive: 'Inactive', login: 'Login to see your alerts' },
    ar: { title: 'تنبيهاتي', subtitle: 'إدارة تنبيهاتك العقارية', search: 'بحث برقم الهاتف', placeholder: 'مثال: 05XX XX XX XX', noAlerts: 'لم يتم العثور على تنبيهات.', active: 'نشط', inactive: 'غير نشط', login: 'سجل الدخول لرؤية تنبيهاتك' }
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'alerts'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(alertsData);
      setHasSearched(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'alerts');
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = async () => {
    if (!searchPhone) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'alerts'), where('phone', '==', searchPhone));
      const snapshot = await getDocs(q);
      const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(alertsData);
      setHasSearched(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'alerts');
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'alerts', id), { active: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `alerts/${id}`);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'alerts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `alerts/${id}`);
    }
  };

  if (!user && !hasSearched) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <LogIn className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold mb-4">{l.login}</h1>
          <Button onClick={loginWithGoogle} className="btn-luxury px-8 py-6">
            <LogIn className="h-4 w-4 mr-2" />
            Google Login
          </Button>
          <div className="mt-12 p-8 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground mb-6">Ou recherchez par numéro de téléphone :</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="tel" 
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder={l.placeholder}
                className="flex-grow bg-background border border-border rounded-xl px-4 py-3 outline-none"
              />
              <Button onClick={handleSearch} disabled={loading} className="btn-luxury px-8">
                {loading ? '...' : l.search}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">{l.title}</h1>
          <p className="text-muted-foreground">{l.subtitle}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="tel" 
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder={l.placeholder}
                className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="btn-luxury px-8">
              {loading ? '...' : l.search}
            </Button>
          </div>
        </div>

        {hasSearched && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${alert.active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Bell className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{alert.type} à {alert.location}</h3>
                      <p className="text-sm text-muted-foreground">Budget: {alert.budget} • {alert.channels?.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleAlert(alert.id, alert.active)}
                      className={alert.active ? 'text-green-600 border-green-200 bg-green-50' : 'text-muted-foreground'}
                    >
                      {alert.active ? <Power className="h-4 w-4 mr-2" /> : <PowerOff className="h-4 w-4 mr-2" />}
                      {alert.active ? l.active : l.inactive}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteAlert(alert.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">{l.noAlerts}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
