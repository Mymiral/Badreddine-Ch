import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, Home, Settings, LogOut, Download, Calendar, Upload } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('month');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('siteLogo', base64String);
        alert('Logo mis à jour avec succès! Rafraîchissez la page pour voir les changements.');
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock Data for Charts
  const wilayaData = [
    { name: 'Alger', listings: 45 },
    { name: 'Oran', listings: 30 },
    { name: 'Constantine', listings: 20 },
    { name: 'Annaba', listings: 15 },
    { name: 'Blida', listings: 10 },
  ];

  const trendData = [
    { name: 'Sem 1', users: 12, views: 150 },
    { name: 'Sem 2', users: 19, views: 230 },
    { name: 'Sem 3', users: 15, views: 180 },
    { name: 'Sem 4', users: 25, views: 320 },
  ];

  const typeData = [
    { name: 'Appartements', value: 60 },
    { name: 'Villas', value: 25 },
    { name: 'Terrains', value: 10 },
    { name: 'Locaux', value: 5 },
  ];
  const COLORS = ['#00F5C4', '#0D0D2B', '#7B2FBE', '#FF4D6D'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
              <span className="text-brand-primary font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-display font-bold">DarLinkDz Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-brand-accent/10 text-brand-accent rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Home className="w-5 h-5" />
            Annonces
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Utilisateurs
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Paramètres
          </a>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold">Tableau de bord Analytique</h1>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-brand-accent text-brand-accent rounded-lg hover:bg-brand-accent/10 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Changer Logo
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              Exporter CSV
            </button>
            <div className="h-6 w-px bg-border"></div>
            <span className="text-sm font-medium">{user.displayName || user.email}</span>
            <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        
        <div className="p-6 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Vue d'ensemble</h2>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
              <button 
                onClick={() => setDateRange('week')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${dateRange === 'week' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Semaine
              </button>
              <button 
                onClick={() => setDateRange('month')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${dateRange === 'month' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Mois
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Annonces</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">124</p>
                <span className="text-sm text-green-500 font-medium mb-1">+12%</span>
              </div>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Nouveaux Utilisateurs</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">89</p>
                <span className="text-sm text-green-500 font-medium mb-1">+5%</span>
              </div>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Vues Totales</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">4,521</p>
                <span className="text-sm text-green-500 font-medium mb-1">+24%</span>
              </div>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Taux de Conversion</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">3.2%</p>
                <span className="text-sm text-red-500 font-medium mb-1">-1.1%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart: Listings by Wilaya */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-6">Annonces par Wilaya (Top 5)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wilayaData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="listings" fill="#00F5C4" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart: Traffic Trends */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-6">Tendance du Trafic</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="views" name="Vues" stroke="#0D0D2B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="users" name="Utilisateurs" stroke="#00F5C4" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pie Chart: Property Types */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-6">Répartition par Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* League Table: Top Agents (Technical Dashboard Recipe) */}
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Performance des Agents</h3>
                <button className="text-sm text-brand-accent hover:underline">Voir tout</button>
              </div>
              <div className="flex flex-col border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-3 border-b border-border bg-muted/30">
                  <div className="font-serif italic text-[11px] opacity-70 uppercase tracking-wider">Agent</div>
                  <div className="font-serif italic text-[11px] opacity-70 uppercase tracking-wider">Annonces</div>
                  <div className="font-serif italic text-[11px] opacity-70 uppercase tracking-wider">Vues</div>
                  <div className="font-serif italic text-[11px] opacity-70 uppercase tracking-wider">Conversion</div>
                  <div className="font-serif italic text-[11px] opacity-70 uppercase tracking-wider">Note</div>
                </div>
                
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-3 border-b border-border hover:bg-foreground hover:text-background transition-colors cursor-pointer group">
                  <div className="font-medium flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-xs group-hover:bg-background group-hover:text-foreground transition-colors">A</div>
                    Amine B.
                  </div>
                  <div className="font-mono tracking-tight text-sm flex items-center">24</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">1,240</div>
                  <div className="font-mono tracking-tight text-sm flex items-center text-green-500 group-hover:text-green-400">4.5%</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">4.8/5</div>
                </div>

                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-3 border-b border-border hover:bg-foreground hover:text-background transition-colors cursor-pointer group">
                  <div className="font-medium flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center text-xs group-hover:bg-background group-hover:text-foreground transition-colors">S</div>
                    Sarah M.
                  </div>
                  <div className="font-mono tracking-tight text-sm flex items-center">18</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">980</div>
                  <div className="font-mono tracking-tight text-sm flex items-center text-green-500 group-hover:text-green-400">3.8%</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">4.9/5</div>
                </div>

                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-3 hover:bg-foreground hover:text-background transition-colors cursor-pointer group">
                  <div className="font-medium flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gray-500/20 text-gray-500 flex items-center justify-center text-xs group-hover:bg-background group-hover:text-foreground transition-colors">K</div>
                    Karim D.
                  </div>
                  <div className="font-mono tracking-tight text-sm flex items-center">12</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">650</div>
                  <div className="font-mono tracking-tight text-sm flex items-center text-red-500 group-hover:text-red-400">1.2%</div>
                  <div className="font-mono tracking-tight text-sm flex items-center">4.2/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
