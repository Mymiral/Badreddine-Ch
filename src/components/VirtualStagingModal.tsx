import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Trash2, Sofa, Lamp, Palette, MousePointer2 } from 'lucide-react';
import { fabric } from 'fabric';

interface VirtualStagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const FURNITURE_ITEMS = [
  { id: 'sofa1', name: 'Modern Sofa', icon: Sofa, type: 'svg', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="%23333"><rect x="10" y="20" width="80" height="20" rx="5"/><rect x="5" y="15" width="15" height="35" rx="5"/><rect x="80" y="15" width="15" height="35" rx="5"/><rect x="15" y="5" width="30" height="20" rx="5"/><rect x="55" y="5" width="30" height="20" rx="5"/></svg>' },
  { id: 'plant1', name: 'Potted Plant', icon: Lamp, type: 'svg', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100" fill="%232e8b57"><path d="M25,0 C10,20 10,40 25,60 C40,40 40,20 25,0 Z"/><rect x="20" y="60" width="10" height="20" fill="%238b4513"/><path d="M15,80 L35,80 L30,100 L20,100 Z" fill="%23555"/></svg>' },
  { id: 'rug1', name: 'Area Rug', icon: Palette, type: 'svg', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" fill="%23c4a484"><rect x="0" y="0" width="200" height="100" rx="10"/><line x1="20" y1="0" x2="20" y2="100" stroke="%238b4513" stroke-width="2"/><line x1="180" y1="0" x2="180" y2="100" stroke="%238b4513" stroke-width="2"/></svg>' },
  { id: 'bed1', name: 'Double Bed', icon: BedDoubleIcon, type: 'svg', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" fill="%23e0e0e0"><rect x="10" y="30" width="100" height="60" rx="5"/><rect x="10" y="10" width="100" height="25" rx="5" fill="%23ccb897"/><rect x="20" y="15" width="35" height="15" rx="5" fill="%23fff"/><rect x="65" y="15" width="35" height="15" rx="5" fill="%23fff"/><rect x="5" y="80" width="110" height="10" rx="2" fill="%23666"/></svg>' },
  { id: 'lamp1', name: 'Floor Lamp', icon: Lamp, type: 'svg', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 120" fill="%23333"><rect x="18" y="30" width="4" height="85" fill="%23444"/><polygon points="0,30 40,30 25,0 15,0" fill="%23fdf5e6"/><rect x="10" y="115" width="20" height="5"/></svg>' }
];

function BedDoubleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M12 4v6" />
      <path d="M2 18h20" />
    </svg>
  );
}

export default function VirtualStagingModal({ isOpen, onClose, imageUrl }: VirtualStagingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !containerRef.current) return;

    // Initialize Fabric canvas
    const container = containerRef.current;
    
    // Calculate dimensions to fit viewport while maintaining some ratio
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
    });
    
    setCanvas(initCanvas);

    // Event listeners for active object
    initCanvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] || null));
    initCanvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] || null));
    initCanvas.on('selection:cleared', () => setActiveObject(null));

    // Load background image
    fabric.Image.fromURL(imageUrl, (img) => {
      if (!img) return;
      
      // Calculate scale to fit canvas
      const scale = Math.min(width / (img.width || width), height / (img.height || height));
      
      img.set({
        originX: 'center',
        originY: 'center',
        left: width / 2,
        top: height / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });
      
      initCanvas.setBackgroundImage(img, initCanvas.renderAll.bind(initCanvas));
    }, { crossOrigin: 'anonymous' });

    const handleResize = () => {
      // Very basic resize handler, typical implementation would be more complex
      if (!containerRef.current) return;
      initCanvas.setWidth(containerRef.current.clientWidth);
      initCanvas.setHeight(containerRef.current.clientHeight);
      initCanvas.renderAll();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      initCanvas.dispose();
      setCanvas(null);
    };
  }, [isOpen, imageUrl]);

  const addItem = (item: typeof FURNITURE_ITEMS[0]) => {
    if (!canvas) return;

    fabric.loadSVGFromURL(item.url, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      
      obj.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center',
        scaleX: 2,
        scaleY: 2,
        cornerColor: '#0CBDD7',
        cornerStrokeColor: '#fff',
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#0CBDD7',
      });
      
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
  };

  const addFilter = (color: string, opacity: number, blendMode: string) => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: color,
      opacity: opacity,
      selectable: false,
      evented: false,
      globalCompositeOperation: blendMode,
    });
    canvas.add(rect);
    canvas.renderAll();
  };

  const addPaintSquare = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      width: 150,
      height: 150,
      fill: '#ADD8E6', // Light blue default paint
      opacity: 0.7,
      originX: 'center',
      originY: 'center',
      cornerColor: '#0CBDD7',
      cornerStrokeColor: '#fff',
      cornerStyle: 'circle',
      transparentCorners: false,
      borderColor: '#0CBDD7',
      globalCompositeOperation: 'overlay', // Blend with background
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };
  const deleteActiveItem = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleDownload = () => {
    if (!canvas) return;
    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High res export
      });
      
      const link = document.createElement('a');
      link.download = `darlink-staging-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Could not export image (possible CORS origin policy issue)", e);
      alert("Error: Cannot download image due to cross-origin constraints on the original photo.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex bg-background/95 backdrop-blur-md">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative" ref={containerRef}>
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button 
              onClick={handleDownload}
              className="bg-brand-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent/90 shadow-md font-medium"
            >
              <Download className="w-4 h-4" /> Save Design
            </button>
            <button 
              onClick={deleteActiveItem}
              disabled={!activeObject}
              className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 shadow-md font-medium disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Remove Item
            </button>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-card/50 text-foreground p-3 rounded-full hover:bg-card shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="rounded-xl overflow-hidden shadow-2xl bg-card border border-border">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Sidebar */}
        <motion.div 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="w-80 bg-card border-l border-border h-full flex flex-col"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Palette className="w-5 h-5 text-brand-accent" />
              Virtual Staging
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Click elements to add them to the photo. Drag to position and use handles to resize.
            </p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar space-y-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Room Enhancements</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addFilter('#FFD700', 0.15, 'overlay')}
                  className="px-3 py-2 text-xs font-medium border border-border rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 transition-all text-left"
                >
                  Warm Lighting
                </button>
                <button
                  onClick={() => addFilter('#87CEFA', 0.15, 'overlay')}
                  className="px-3 py-2 text-xs font-medium border border-border rounded-lg bg-[#87CEFA]/10 hover:bg-[#87CEFA]/20 transition-all text-left"
                >
                  Cool Lighting
                </button>
                <button
                  onClick={addPaintSquare}
                  className="px-3 py-2 text-xs font-medium border border-border rounded-lg bg-card hover:bg-muted transition-all col-span-2 text-center"
                >
                  Add Paint/Wall Area
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Furniture Library</h3>
              <div className="grid grid-cols-2 gap-3">
                {FURNITURE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item)}
                    className="flex flex-col items-center justify-center p-4 border border-border rounded-xl hover:border-brand-accent hover:bg-brand-accent/5 transition-all group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center text-muted-foreground group-hover:text-brand-accent mb-2">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-medium text-center">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
