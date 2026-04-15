import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Paintbrush, Sofa, RefreshCw, Download, Upload, Check } from 'lucide-react';
import { Button } from './ui/button';

interface RenovationSimulatorProps {
  initialImage: string;
}

export default function RenovationSimulator({ initialImage }: RenovationSimulatorProps) {
  const { language } = useApp();
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const colors = [
    { name: 'Blanc Pur', hex: '#FFFFFF' },
    { name: 'Crème', hex: '#F5F5DC' },
    { name: 'Gris Perle', hex: '#E0E0E0' },
    { name: 'Bleu Ciel', hex: '#87CEEB' },
    { name: 'Vert Sauge', hex: '#BC8F8F' },
    { name: 'Terracotta', hex: '#E2725B' },
    { name: 'Beige Sable', hex: '#F5F5DC' },
    { name: 'Gris Anthracite', hex: '#36454F' },
    { name: 'Jaune Moutarde', hex: '#FFDB58' },
    { name: 'Rose Poudré', hex: '#FFD1DC' },
    { name: 'Vert Émeraude', hex: '#50C878' },
    { name: 'Bleu Marine', hex: '#000080' },
    { name: 'Noir Mat', hex: '#28282B' },
    { name: 'Chocolat', hex: '#7B3F00' },
    { name: 'Lilas', hex: '#C8A2C8' }
  ];

  const furnitureStyles = [
    { id: 'modern', name: 'Moderne', icon: '🛋️' },
    { id: 'classic', name: 'Classique', icon: '🪑' },
    { id: 'minimalist', name: 'Minimaliste', icon: '⬜' },
    { id: 'luxury', name: 'Luxueux', icon: '💎' },
    { id: 'rustic', name: 'Rustique', icon: '🪵' }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsSimulating(false);
      // In a real app, this would call an AI API
      // For now, we just show a "success" state
      alert('Simulation terminée ! (Ceci est une démo UI)');
    }, 2000);
  };

  const labels = {
    fr: { title: 'Simulateur de rénovation', paint: 'Peinture', furniture: 'Meubles', simulate: 'Voir le résultat IA', upload: 'Uploader ma photo', reset: 'Réinitialiser' },
    en: { title: 'Renovation Simulator', paint: 'Paint', furniture: 'Furniture', simulate: 'See AI Result', upload: 'Upload my photo', reset: 'Reset' },
    ar: { title: 'محاكي التجديد', paint: 'طلاء', furniture: 'أثاث', simulate: 'رؤية نتيجة الذكاء الاصطناعي', upload: 'تحميل صورتي', reset: 'إعادة ضبط' }
  };

  const l = labels[language as keyof typeof labels];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
      <div className="p-6 border-b border-border bg-primary/5 flex justify-between items-center">
        <h3 className="text-xl font-display font-bold flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-primary" />
          {l.title}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setCurrentImage(initialImage)}>
          {l.reset}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Preview Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-full h-full object-cover transition-all duration-500"
            style={{ 
              filter: selectedColor ? `sepia(0.3) hue-rotate(${parseInt(selectedColor.slice(1), 16) % 360}deg) brightness(1.1)` : 'none',
              opacity: isSimulating ? 0.5 : 1
            }}
          />
          {isSimulating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
              <RefreshCw className="h-12 w-12 animate-spin mb-4" />
              <p className="font-medium animate-pulse">Traitement par IA en cours...</p>
            </div>
          )}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button size="sm" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40">
              <Upload className="h-4 w-4 mr-2" />
              {l.upload}
            </Button>
            <Button size="sm" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls Area */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[500px]">
          {/* Paint Selection */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <Paintbrush className="h-4 w-4 mr-2" />
              {l.paint}
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all relative group ${
                    selectedColor === color.hex ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`h-4 w-4 ${parseInt(color.hex.slice(1), 16) > 0x888888 ? 'text-black' : 'text-white'}`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Furniture Selection */}
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <Sofa className="h-4 w-4 mr-2" />
              {l.furniture}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {furnitureStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedFurniture(style.id)}
                  className={`flex items-center p-3 rounded-xl border-2 transition-all ${
                    selectedFurniture === style.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30 hover:bg-accent'
                  }`}
                >
                  <span className="text-2xl mr-3">{style.icon}</span>
                  <span className="font-medium">{style.name}</span>
                </button>
              ))}
            </div>
          </section>

          <Button 
            onClick={handleSimulate} 
            className="w-full btn-luxury py-8 text-lg"
            disabled={isSimulating || (!selectedColor && !selectedFurniture)}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isSimulating ? 'animate-spin' : ''}`} />
            {l.simulate}
          </Button>
        </div>
      </div>
    </div>
  );
}
