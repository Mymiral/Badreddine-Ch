import React, { useMemo } from 'react';
import { Map } from 'react-algeria-map';
import { useTheme } from 'next-themes';

interface AlgeriaMapFilterProps {
  properties: any[];
  selectedWilaya: string;
  onWilayaSelect: (wilaya: string) => void;
}

const wilayasList = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El Meghaier", "El Menia"
];

const AlgeriaMapFilter: React.FC<AlgeriaMapFilterProps> = ({ properties, selectedWilaya, onWilayaSelect }) => {
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    wilayasList.forEach(w => counts[w] = 0);
    
    properties.forEach(p => {
      // Try to match property location to a wilaya
      const loc = p.location?.toLowerCase() || '';
      const matchedWilaya = wilayasList.find(w => loc.includes(w.toLowerCase()));
      if (matchedWilaya) {
        counts[matchedWilaya]++;
      }
    });
    
    // For react-algeria-map, the value is what's displayed on hover.
    // We can format it nicely.
    const mapData: Record<string, string> = {};
    Object.keys(counts).forEach(key => {
      mapData[key] = `${counts[key]} annonce${counts[key] > 1 ? 's' : ''}`;
    });
    
    return mapData;
  }, [properties]);

  const handleWilayaClick = (wilaya: string) => {
    if (selectedWilaya === wilaya) {
      onWilayaSelect(''); // Deselect
    } else {
      onWilayaSelect(wilaya);
    }
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold mb-4">Filtrer par Wilaya</h3>
      <div className="w-full max-w-[400px] aspect-square relative">
        <Map
          color={isDark ? '#1e293b' : '#f1f5f9'}
          HoverColor={isDark ? '#334155' : '#e2e8f0'}
          stroke={isDark ? '#334155' : '#cbd5e1'}
          hoverStroke={isDark ? '#00F5C4' : '#00F5C4'}
          height="100%"
          width="100%"
          data={data}
          onWilayaClick={handleWilayaClick}
        />
        {selectedWilaya && (
          <div className="absolute top-0 right-0 bg-brand-accent text-brand-primary px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
            {selectedWilaya}
            <button onClick={() => onWilayaSelect('')} className="hover:text-red-500">&times;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgeriaMapFilter;
