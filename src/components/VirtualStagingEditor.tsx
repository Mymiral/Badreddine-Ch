import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Paintbrush, Square, Palette, RefreshCw, Download, 
  Trash2, Move, RotateCw, Sparkles, Sun, Contrast, Maximize2, Undo, Circle, Eraser, Check
} from 'lucide-react';

// Inline SVGs for the furniture stickers (to prevent CORS issues)
const FURNITURE_CATALOG = [
  {
    id: 'sofa',
    name: 'Canapé Cosy',
    category: 'Salon',
    svg: `<svg viewBox="0 0 120 70" width="120" height="70" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="15" width="110" height="45" rx="12" fill="#2A3D54" />
      <rect x="12" y="20" width="45" height="35" rx="6" fill="#3D5675" />
      <rect x="63" y="20" width="45" height="35" rx="6" fill="#3D5675" />
      <rect x="2" y="22" width="12" height="32" rx="5" fill="#1C2D42" />
      <rect x="106" y="22" width="12" height="32" rx="5" fill="#1C2D42" />
      <rect x="8" y="55" width="104" height="8" rx="2" fill="#1C2D42" />
      <rect x="18" y="62" width="8" height="6" fill="#8C6239" />
      <rect x="94" y="62" width="8" height="6" fill="#8C6239" />
    </svg>`
  },
  {
    id: 'bed',
    name: 'Lit Double',
    category: 'Chambre',
    svg: `<svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="90" height="15" rx="4" fill="#4B5563" />
      <rect x="5" y="20" width="90" height="75" rx="6" fill="#F3F4F6" />
      <rect x="10" y="25" width="38" height="20" rx="3" fill="#D1D5DB" />
      <rect x="52" y="25" width="38" height="20" rx="3" fill="#D1D5DB" />
      <rect x="5" y="50" width="90" height="45" fill="#9CA3AF" />
      <path d="M 5 50 L 95 50 L 95 55 L 5 55 Z" fill="#E5E7EB" />
    </svg>`
  },
  {
    id: 'armchair',
    name: 'Fauteuil Nordique',
    category: 'Salon',
    svg: `<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="15" width="60" height="50" rx="10" fill="#E07A5F" />
      <rect x="18" y="20" width="44" height="40" rx="6" fill="#F4F1DE" />
      <rect x="5" y="25" width="12" height="35" rx="4" fill="#3D405B" />
      <rect x="63" y="25" width="12" height="35" rx="4" fill="#3D405B" />
      <line x1="20" y1="65" x2="15" y2="78" stroke="#3D405B" stroke-width="4" stroke-linecap="round"/>
      <line x1="60" y1="65" x2="65" y2="78" stroke="#3D405B" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'plant',
    name: 'Plante verte',
    category: 'Décoration',
    svg: `<svg viewBox="0 0 60 90" width="60" height="90" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="80" rx="18" ry="6" fill="#4B3621" />
      <path d="M 22 65 L 38 65 L 35 85 L 25 85 Z" fill="#D5A6BD" />
      <path d="M 30 65 Q 10 40 15 20 Q 20 5 30 40 Q 30 65 30 65" fill="#2D6A4F" />
      <path d="M 30 65 Q 50 40 45 20 Q 40 5 30 40 Q 30 65 30 65" fill="#40916C" />
      <path d="M 30 65 Q 30 35 30 10 Q 30 0 30 10 Q 30 35 30 65" stroke="#1B4332" stroke-width="2" />
      <path d="M 30 45 Q 15 30 22 15 Q 35 10 30 45" fill="#52B788" />
      <path d="M 30 50 Q 45 35 38 15 Q 25 10 30 50" fill="#74C69D" />
    </svg>`
  },
  {
    id: 'rug',
    name: 'Tapis Chic',
    category: 'Décoration',
    svg: `<svg viewBox="0 0 140 80" width="140" height="80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="40" rx="65" ry="35" fill="#C084FC" />
      <ellipse cx="70" cy="40" rx="58" ry="30" fill="#F3E8FF" />
      <path d="M 12 40 C 30 15, 110 15, 128 40 C 110 65, 30 65, 12 40 Z" fill="#FAF5FF" opacity="0.6" />
      <ellipse cx="70" cy="40" rx="40" ry="20" fill="#E9D5FF" />
    </svg>`
  },
  {
    id: 'table',
    name: 'Table basse',
    category: 'Salon',
    svg: `<svg viewBox="0 0 100 60" width="100" height="60" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="20" rx="45" ry="15" fill="#A1A1AA" />
      <ellipse cx="50" cy="18" rx="45" ry="15" fill="#F4F4F5" />
      <line x1="25" y1="28" x2="20" y2="52" stroke="#27272A" stroke-width="4" stroke-linecap="round" />
      <line x1="75" y1="28" x2="80" y2="52" stroke="#27272A" stroke-width="4" stroke-linecap="round" />
      <line x1="50" y1="32" x2="50" y2="55" stroke="#3F3F46" stroke-width="4" stroke-linecap="round" />
    </svg>`
  },
  {
    id: 'lamp',
    name: 'Lampadaire',
    category: 'Luminaire',
    svg: `<svg viewBox="0 0 50 110" width="50" height="110" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 15 L 25 100" stroke="#4B5563" stroke-width="4" />
      <ellipse cx="25" cy="100" rx="20" ry="6" fill="#1F2937" />
      <path d="M 10 40 L 40 40 L 32 15 L 18 15 Z" fill="#F59E0B" />
      <circle cx="25" cy="46" r="10" fill="#FDE047" opacity="0.9" />
    </svg>`
  }
];

const WALL_COLORS = [
  { name: 'Vert Sauge', code: '#8F9779', label: 'Sage' },
  { name: 'Terracotta', code: '#C97A63', label: 'Terracotta' },
  { name: 'Bleu Brume', code: '#728C9A', label: 'Mist' },
  { name: 'Beige Chaleureux', code: '#DFD3C3', label: 'Beige' },
  { name: 'Lavande Douce', code: '#C4B7CB', label: 'Lavender' },
  { name: 'Blanc Pur', code: '#F5F5F5', label: 'White' },
  { name: 'Jaune Ocre', code: '#D9A05B', label: 'Ochre' },
];

interface StickerInstance {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in radians
  flipped: boolean;
  imageObj: HTMLImageElement | null;
}

interface PaintStroke {
  points: { x: number; y: number }[];
  color: string;
  brushSize: number;
}

interface VirtualStagingEditorProps {
  imageUrl: string;
  onClose: () => void;
  propertyName: string;
}

export const VirtualStagingEditor: React.FC<VirtualStagingEditorProps> = ({ imageUrl, onClose, propertyName }) => {
  const [activeTab, setActiveTab] = useState<'furniture' | 'paint' | 'lighting'>('furniture');
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  
  // Paint parameters
  const [paintColor, setPaintColor] = useState(WALL_COLORS[0].code);
  const [brushSize, setBrushSize] = useState(16);
  const [paintMode, setPaintMode] = useState<'draw' | 'erase' | 'select'>('select');
  const [paintStrokes, setPaintStrokes] = useState<PaintStroke[]>([]);
  const [strokeHistory, setStrokeHistory] = useState<PaintStroke[][]>([]);
  
  // Lighting filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  
  // Drag states
  const isDraggingRef = useRef(false);
  const isRotatingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const selectedStickerOffsetRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentStrokePointsRef = useRef<{ x: number; y: number }[]>([]);

  // Pre-load background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      bgImageRef.current = img;
      redrawCanvas();
    };
  }, [imageUrl]);

  // Redraw canvas loop
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImageRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply lighting filters for background drawing (Vite CSS filters apply locally, but to bake it in or render clean preview:)
    ctx.save();
    // 1. Draw Background Image fitting keeping aspect ratio
    const img = bgImageRef.current;
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawW = canvas.width;
    let drawH = canvas.height;
    let drawX = 0;
    let drawY = 0;
    
    if (imgRatio > canvasRatio) {
      drawH = canvas.width / imgRatio;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawW = canvas.height * imgRatio;
      drawX = (canvas.width - drawW) / 2;
    }

    // Apply canvas contextual filters if supported
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.filter = 'none'; // reset filter for overlays
    ctx.restore();

    // 2. Draw Paint strokes (wall simulation)
    ctx.save();
    // We render strokes with overlay/multiply composite settings to look like realistic translucent wall painting
    ctx.globalAlpha = 0.55;
    
    const drawStroke = (stroke: PaintStroke) => {
      if (stroke.points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    };

    // Draw saved strokes
    paintStrokes.forEach(stroke => {
      ctx.globalCompositeOperation = 'source-over'; // Eraser handles destination-out
      if (stroke.color === 'transparent') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1.0;
      } else {
        ctx.globalAlpha = 0.55;
        // multiply or overlay gives nice texture bleed
        ctx.globalCompositeOperation = 'multiply';
      }
      drawStroke(stroke);
    });

    // Draw active stroke
    if (currentStrokePointsRef.current.length > 0) {
      if (paintMode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1.0;
        drawStroke({ points: currentStrokePointsRef.current, color: 'transparent', brushSize });
      } else {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.55;
        drawStroke({ points: currentStrokePointsRef.current, color: paintColor, brushSize });
      }
    }
    ctx.restore();

    // 3. Draw Furniture Stickers
    stickers.forEach((sticker) => {
      if (!sticker.imageObj) return;

      ctx.save();
      // Translate to sticker center
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate(sticker.rotation);
      if (sticker.flipped) {
        ctx.scale(-1, 1);
      }

      // Draw the sticker image centered
      ctx.drawImage(
        sticker.imageObj, 
        -sticker.width / 2, 
        -sticker.height / 2, 
        sticker.width, 
        sticker.height
      );

      ctx.restore();

      // Draw interactive handles if selected
      if (selectedStickerId === sticker.id && paintMode === 'select') {
        ctx.save();
        ctx.translate(sticker.x, sticker.y);
        ctx.rotate(sticker.rotation);

        // Border outline
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
        ctx.setLineDash([]);

        // Rotation Handle (top)
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(0, -sticker.height / 2 - 15, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -sticker.height / 2);
        ctx.lineTo(0, -sticker.height / 2 - 15);
        ctx.strokeStyle = '#3b82f6';
        ctx.stroke();

        // Resize Handle (bottom right corner)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(sticker.width / 2, sticker.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.restore();
      }
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [stickers, selectedStickerId, paintColor, brushSize, paintMode, paintStrokes, brightness, contrast, saturation]);

  // Add furniture to canvas workspace
  const handleAddSticker = (catalogId: string) => {
    const item = FURNITURE_CATALOG.find(f => f.id === catalogId);
    if (!item) return;

    const img = new Image();
    // Wrap SVG string in safety URI
    const svgBase64 = btoa(unescape(encodeURIComponent(item.svg)));
    img.src = `data:image/svg+xml;base64,${svgBase64}`;

    img.onload = () => {
      const canvas = canvasRef.current;
      const initialX = canvas ? canvas.width / 2 : 250;
      const initialY = canvas ? canvas.height / 2 : 200;

      const newSticker: StickerInstance = {
        id: `sticker_${Date.now()}`,
        type: catalogId,
        x: initialX,
        y: initialY,
        width: 100,
        height: 80,
        rotation: 0,
        flipped: false,
        imageObj: img
      };

      setStickers([...stickers, newSticker]);
      setSelectedStickerId(newSticker.id);
      setPaintMode('select');
      setActiveTab('furniture');
    };
  };

  // Check if pointer is on a specific handle
  const getHandleAtPosition = (sticker: StickerInstance, mx: number, my: number) => {
    // Convert mouse coordinate to local sticker coordinate space
    const dx = mx - sticker.x;
    const dy = my - sticker.y;
    const cos = Math.cos(-sticker.rotation);
    const sin = Math.sin(-sticker.rotation);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    // Resize handle check: bottom right corner (+w/2, +h/2)
    const resizeHandleRadius = 10;
    const distToResize = Math.hypot(lx - sticker.width / 2, ly - sticker.height / 2);
    if (distToResize <= resizeHandleRadius) return 'resize';

    // Rotation handle check: top center (0, -h/2 - 15)
    const distToRotate = Math.hypot(lx, ly - (-sticker.height / 2 - 15));
    if (distToRotate <= resizeHandleRadius) return 'rotate';

    // Body check
    if (Math.abs(lx) <= sticker.width / 2 && Math.abs(ly) <= sticker.height / 2) return 'body';

    return null;
  };

  // Canvas Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    lastMousePosRef.current = { x: mx, y: my };

    if (paintMode === 'draw' || paintMode === 'erase') {
      isDraggingRef.current = true;
      currentStrokePointsRef.current = [{ x: mx, y: my }];
      redrawCanvas();
      return;
    }

    // Select Mode
    // Search backward to pick top layers first
    for (let i = stickers.length - 1; i >= 0; i--) {
      const sticker = stickers[i];
      const handle = getHandleAtPosition(sticker, mx, my);
      if (handle) {
        setSelectedStickerId(sticker.id);
        if (handle === 'rotate') {
          isRotatingRef.current = true;
        } else if (handle === 'resize') {
          isResizingRef.current = true;
        } else {
          isDraggingRef.current = true;
          selectedStickerOffsetRef.current = {
            x: mx - sticker.x,
            y: my - sticker.y
          };
        }
        return;
      }
    }

    // Clicked empty space
    setSelectedStickerId(null);
  };

  // Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (paintMode === 'draw' || paintMode === 'erase') {
      if (isDraggingRef.current) {
        currentStrokePointsRef.current.push({ x: mx, y: my });
        redrawCanvas();
      }
      return;
    }

    // Select actions
    if (!selectedStickerId) return;
    const index = stickers.findIndex(s => s.id === selectedStickerId);
    if (index === -1) return;
    const sticker = stickers[index];

    if (isDraggingRef.current) {
      const updated = [...stickers];
      updated[index] = {
        ...sticker,
        x: mx - selectedStickerOffsetRef.current.x,
        y: my - selectedStickerOffsetRef.current.y
      };
      setStickers(updated);
    } else if (isRotatingRef.current) {
      const angle = Math.atan2(my - sticker.y, mx - sticker.x) + Math.PI / 2;
      const updated = [...stickers];
      updated[index] = {
        ...sticker,
        rotation: angle
      };
      setStickers(updated);
    } else if (isResizingRef.current) {
      // Find delta from sticker center
      const dx = mx - sticker.x;
      const dy = my - sticker.y;
      const cos = Math.cos(-sticker.rotation);
      const sin = Math.sin(-sticker.rotation);
      const lx = dx * cos - dy * sin;
      const ly = dx * sin + dy * cos;

      const updated = [...stickers];
      updated[index] = {
        ...sticker,
        width: Math.max(30, lx * 2),
        height: Math.max(20, ly * 2)
      };
      setStickers(updated);
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = () => {
    if ((paintMode === 'draw' || paintMode === 'erase') && isDraggingRef.current) {
      if (currentStrokePointsRef.current.length > 0) {
        const strokeColor = paintMode === 'erase' ? 'transparent' : paintColor;
        const newStroke = {
          points: [...currentStrokePointsRef.current],
          color: strokeColor,
          brushSize
        };
        const nextStrokes = [...paintStrokes, newStroke];
        setPaintStrokes(nextStrokes);
        setStrokeHistory([...strokeHistory.slice(0, 15), nextStrokes]);
      }
      currentStrokePointsRef.current = [];
    }

    isDraggingRef.current = false;
    isRotatingRef.current = false;
    isResizingRef.current = false;
    redrawCanvas();
  };

  // Undo paint actions
  const handleUndoPaint = () => {
    if (paintStrokes.length === 0) return;
    const nextStrokes = paintStrokes.slice(0, -1);
    setPaintStrokes(nextStrokes);
  };

  // Delete active furniture
  const handleDeleteSticker = () => {
    if (!selectedStickerId) return;
    setStickers(stickers.filter(s => s.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  // Flip selected furniture
  const handleFlipSticker = () => {
    if (!selectedStickerId) return;
    setStickers(stickers.map(s => {
      if (s.id === selectedStickerId) {
        return { ...s, flipped: !s.flipped };
      }
      return s;
    }));
  };

  // Export & Download Edited Image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Deselect before rendering output
    setSelectedStickerId(null);
    
    // Draw without selections handles
    setTimeout(() => {
      redrawCanvas();
      
      try {
        const link = document.createElement('a');
        link.download = `Renovation_${propertyName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Download failed due to tainted canvas or permissions:', err);
        alert('Votre rénovation est prête ! En raison de restrictions de sécurité de l\'image d\'origine, veuillez faire une capture d\'écran de votre création.');
      }
    }, 100);
  };

  // Generate shareable local state link
  const handleShare = () => {
    const stateObj = {
      stickers: stickers.map(s => ({ type: s.type, x: s.x, y: s.y, w: s.width, h: s.height, r: s.rotation, f: s.flipped })),
      paint: paintStrokes,
      filters: { brightness, contrast, saturation }
    };
    const stateStr = btoa(JSON.stringify(stateObj));
    const shareUrl = `${window.location.origin}${window.location.pathname}?staging=${stateStr}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Lien de partage copié dans le presse-papiers ! Vos amis pourront voir vos modifications en temps réel.");
    }).catch(err => {
      console.error("Failed to copy link:", err);
    });
  };

  // Clear workspace
  const handleClearAll = () => {
    if (window.confirm("Voulez-vous réinitialiser toutes les modifications ?")) {
      setStickers([]);
      setSelectedStickerId(null);
      setPaintStrokes([]);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col md:flex-row text-white overflow-hidden">
      
      {/* Editor Main Canvas Board */}
      <div className="flex-1 flex flex-col relative p-4 h-[60vh] md:h-full justify-center items-center">
        
        {/* Top bar controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
            <span className="font-bold text-sm text-gray-200">Simulateur de Rénovation</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 transition-all text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Partager
            </button>
            <button 
              onClick={handleDownload}
              className="bg-brand-accent text-black font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-brand-accent/90 transition-all"
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
            <button 
              onClick={onClose}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/40 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Workspace Canvas */}
        <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-full max-h-[85%] bg-zinc-950">
          <canvas 
            ref={canvasRef}
            width={800}
            height={550}
            className={`max-w-full block aspect-video ${
              paintMode === 'draw' ? 'cursor-crosshair' : 
              paintMode === 'erase' ? 'cursor-cell' : 'cursor-default'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Action Tips Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
          <p className="text-xs text-white/50 bg-black/60 px-4 py-2 rounded-full inline-block backdrop-blur-sm">
            {paintMode === 'select' && selectedStickerId && "Faites glisser les poignées bleues ou vertes pour redimensionner ou faire pivoter le meuble."}
            {paintMode === 'select' && !selectedStickerId && "Sélectionnez un meuble à gauche pour l'ajouter, ou dessinez sur le mur."}
            {paintMode === 'draw' && "Faites glisser le pinceau sur les murs pour appliquer une nouvelle couleur."}
            {paintMode === 'erase' && "Utilisez la gomme pour effacer les traces de peinture."}
          </p>
        </div>
      </div>

      {/* Editor Control Settings Panel */}
      <div className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-white/10 bg-zinc-900 flex flex-col h-[40vh] md:h-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-zinc-950/50">
          <button 
            onClick={() => { setActiveTab('furniture'); setPaintMode('select'); }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'furniture' ? 'border-brand-accent text-brand-accent bg-white/5' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Square className="w-4 h-4" /> Meubles
          </button>
          <button 
            onClick={() => { setActiveTab('paint'); setPaintMode('draw'); }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'paint' ? 'border-brand-accent text-brand-accent bg-white/5' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Paintbrush className="w-4 h-4" /> Peinture
          </button>
          <button 
            onClick={() => { setActiveTab('lighting'); setPaintMode('select'); }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'lighting' ? 'border-brand-accent text-brand-accent bg-white/5' : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" /> Lumière
          </button>
        </div>

        {/* Tab panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Furniture Panel */}
          {activeTab === 'furniture' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider mb-3">Catalogue de Mobilier</h4>
                <div className="grid grid-cols-2 gap-3">
                  {FURNITURE_CATALOG.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleAddSticker(item.id)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.03]"
                    >
                      <div className="h-16 flex items-center justify-center bg-black/40 rounded-lg p-2 w-full" dangerouslySetInnerHTML={{ __html: item.svg }} />
                      <span className="text-xs font-semibold text-gray-300">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedStickerId && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
                  <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Meuble Sélectionné</h5>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleFlipSticker}
                      className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-white/5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retourner
                    </button>
                    <button 
                      onClick={handleDeleteSticker}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 py-2 rounded-lg text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 border border-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Retirer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paint Panel */}
          {activeTab === 'paint' && (
            <div className="space-y-6">
              <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
                <button
                  onClick={() => setPaintMode('draw')}
                  className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paintMode === 'draw' ? 'bg-brand-accent text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" /> Pinceau
                </button>
                <button
                  onClick={() => setPaintMode('erase')}
                  className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paintMode === 'erase' ? 'bg-brand-accent text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" /> Gomme
                </button>
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider mb-3">Palette Rénovation</h4>
                <div className="grid grid-cols-4 gap-2">
                  {WALL_COLORS.map((c) => (
                    <button 
                      key={c.code}
                      onClick={() => {
                        setPaintColor(c.code);
                        setPaintMode('draw');
                      }}
                      className={`h-10 rounded-lg border-2 transition-all relative flex items-center justify-center ${
                        paintColor === c.code && paintMode === 'draw' ? 'border-brand-accent scale-[1.08]' : 'border-transparent hover:scale-[1.05]'
                      }`}
                      style={{ backgroundColor: c.code }}
                      title={c.name}
                    >
                      {paintColor === c.code && paintMode === 'draw' && (
                        <Check className="w-4 h-4 text-black drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                  <span>Taille du Pinceau</span>
                  <span>{brushSize}px</span>
                </div>
                <input 
                  type="range" 
                  min={8} 
                  max={48} 
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-brand-accent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUndoPaint}
                  disabled={paintStrokes.length === 0}
                  className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-white/5 transition-all"
                >
                  <Undo className="w-4 h-4" /> Annuler le trait
                </button>
              </div>
            </div>
          )}

          {/* Lighting Panel */}
          {activeTab === 'lighting' && (
            <div className="space-y-6">
              <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider">Ajuster l'Ambiance</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Luminosité</span>
                    <span>{brightness}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={150} 
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-brand-accent"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Contraste</span>
                    <span>{contrast}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={150} 
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-brand-accent"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={150} 
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-brand-accent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear and Reset Buttons Footer */}
        <div className="p-6 border-t border-white/10 bg-zinc-950 flex gap-3">
          <button 
            onClick={handleClearAll}
            className="flex-1 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 py-3 rounded-xl text-xs font-bold transition-all"
          >
            Réinitialiser tout
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-100 text-black py-3 rounded-xl text-xs font-bold transition-all"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  );
};
