import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateAiImage, remixImage, generateImageOverlays } from '../services/groqService';

// --- TIPOS ---
interface TextLayer {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  rotation: number;
}

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Playfair', value: '"Playfair Display", serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
];

const PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
];

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ isOpen, onClose, initialPrompt = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [remixLoading, setRemixLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(initialPrompt);
  const [showPromptBar, setShowPromptBar] = useState(true);

  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Painel ativo: null | 'text' | 'style'
  const [activePanel, setActivePanel] = useState<null | 'text' | 'style'>(null);
  const [editingText, setEditingText] = useState('');

  // Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sync prompt when opened
  useEffect(() => {
    if (isOpen) {
      setAiPrompt(initialPrompt);
      setShowPromptBar(true);
    }
  }, [isOpen, initialPrompt]);

  // Block body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // --- CANVAS DRAW ---
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxW = Math.min(img.width, 1080);
      const ratio = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * ratio;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      layers.forEach(layer => {
        ctx.save();
        const weight = layer.isBold ? 'bold' : 'normal';
        const style = layer.isItalic ? 'italic' : 'normal';
        ctx.font = `${style} ${weight} ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        const m = ctx.measureText(layer.text);
        const padX = 18, padY = 10;
        const bw = m.width + padX * 2;
        const bh = layer.fontSize + padY * 2;

        // Background
        if (layer.backgroundColor !== 'transparent') {
          ctx.fillStyle = layer.backgroundColor;
          const r = 8;
          ctx.beginPath();
          ctx.moveTo(-bw / 2 + r, -bh / 2);
          ctx.lineTo(bw / 2 - r, -bh / 2);
          ctx.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + r);
          ctx.lineTo(bw / 2, bh / 2 - r);
          ctx.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - r, bh / 2);
          ctx.lineTo(-bw / 2 + r, bh / 2);
          ctx.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - r);
          ctx.lineTo(-bw / 2, -bh / 2 + r);
          ctx.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + r, -bh / 2);
          ctx.closePath();
          ctx.fill();
        }

        // Border stroke before fill
        if (layer.borderWidth > 0) {
          ctx.strokeStyle = layer.borderColor;
          ctx.lineWidth = layer.borderWidth * 2;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.shadowBlur = 0;
          ctx.strokeText(layer.text, 0, 0);
        }

        // Text fill
        ctx.fillStyle = layer.color;
        ctx.shadowColor = layer.backgroundColor === 'transparent' ? 'rgba(0,0,0,0.7)' : 'transparent';
        ctx.shadowBlur = layer.backgroundColor === 'transparent' ? 6 : 0;
        ctx.fillText(layer.text, 0, 0);

        // Selection ring
        if (selectedId === layer.id) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(-bw / 2 - 4, -bh / 2 - 4, bw + 8, bh + 8);
          ctx.setLineDash([]);
        }

        ctx.restore();
      });
    };
  }, [imageSrc, layers, selectedId]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  // --- CANVAS INTERACTIONS ---
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = 'touches' in e ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasStart = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hit = [...layers].reverse().find(layer => {
      ctx.font = `${layer.isBold ? 'bold' : 'normal'} ${layer.fontSize}px ${layer.fontFamily}`;
      const m = ctx.measureText(layer.text);
      const hw = m.width / 2 + 20;
      const hh = layer.fontSize / 2 + 12;
      const dx = pos.x - layer.x;
      const dy = pos.y - layer.y;
      return Math.abs(dx) < hw && Math.abs(dy) < hh;
    });

    if (hit) {
      setSelectedId(hit.id);
      setIsDragging(true);
      setDragStart({ x: pos.x - hit.x, y: pos.y - hit.y });
      setEditingText(hit.text);
    } else {
      setSelectedId(null);
      setActivePanel(null);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || selectedId === null) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    setLayers(prev => prev.map(l =>
      l.id === selectedId ? { ...l, x: pos.x - dragStart.x, y: pos.y - dragStart.y } : l
    ));
  };

  const handleCanvasEnd = () => setIsDragging(false);

  // --- LAYER ACTIONS ---
  const addLayer = (text = 'Texto') => {
    const canvas = canvasRef.current;
    const w = canvas?.width || 800;
    const h = canvas?.height || 600;
    const newLayer: TextLayer = {
      id: Date.now(),
      text,
      x: w / 2,
      y: h / 2,
      color: '#ffffff',
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 0,
      fontSize: 64,
      fontFamily: 'Inter, sans-serif',
      isBold: true,
      isItalic: false,
      rotation: 0,
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedId(newLayer.id);
    setEditingText(newLayer.text);
    setActivePanel('text');
  };

  const updateLayer = (id: number, key: keyof TextLayer, value: any) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: value } : l));
  };

  const deleteLayer = (id: number) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    setSelectedId(null);
    setActivePanel(null);
  };

  const selectedLayer = layers.find(l => l.id === selectedId);

  // --- IMAGE ACTIONS ---
  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) return;
    setImageLoading(true);
    setShowPromptBar(false);
    try {
      const base64 = await generateAiImage(aiPrompt);
      setImageSrc(base64);
      setLayers([]);
      setSelectedId(null);
    } catch { alert('Erro ao gerar imagem.'); setShowPromptBar(true); }
    finally { setImageLoading(false); }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setLayers([]);
      setSelectedId(null);
      setShowPromptBar(false);
    }
  };

  const handleRemix = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;
    setRemixLoading(true);
    try {
      const remixed = await remixImage(canvas.toDataURL('image/png'), aiPrompt || 'Make it photorealistic and professional');
      setImageSrc(remixed);
    } catch { alert('Erro ao recriar imagem.'); }
    finally { setRemixLoading(false); }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Desenha sem seleção
    const prevSelected = selectedId;
    setSelectedId(null);
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = 'post-mapsguru.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setSelectedId(prevSelected);
    }, 100);
  };

  const handleGetSuggestions = async () => {
    if (!aiPrompt) return;
    try {
      const s = await generateImageOverlays(aiPrompt);
      setSuggestions(s);
    } catch { console.error('Erro sugestões'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ===== TOP BAR ===== */}
      <div className="flex items-center justify-between px-4 py-3 z-10 flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>

        {/* Fechar */}
        <button onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <span className="text-white font-bold text-sm tracking-wide drop-shadow">Editor de Imagem</span>

        {/* Download */}
        <button onClick={handleDownload} disabled={!imageSrc}
          className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full disabled:opacity-30 transition-all active:scale-95">
          Salvar
        </button>
      </div>

      {/* ===== CANVAS AREA ===== */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center overflow-hidden relative px-2">

        {!imageSrc && !imageLoading && (
          <div className="flex flex-col items-center gap-6 text-white/60 select-none">
            <div className="w-20 h-20 rounded-3xl border-2 border-white/20 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-center">Gere uma imagem com IA<br/>ou faça upload de uma foto</p>
          </div>
        )}

        {imageLoading && (
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" style={{ borderWidth: 3 }} />
            <p className="text-sm font-medium">Gerando imagem...</p>
          </div>
        )}

        {imageSrc && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasStart}
            onMouseMove={handleCanvasMove}
            onMouseUp={handleCanvasEnd}
            onMouseLeave={handleCanvasEnd}
            onTouchStart={handleCanvasStart}
            onTouchMove={handleCanvasMove}
            onTouchEnd={handleCanvasEnd}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            style={{ cursor: isDragging ? 'grabbing' : 'default', touchAction: 'none' }}
          />
        )}

        {/* Remix loading overlay */}
        {remixLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-sm font-medium">Recriando...</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== PROMPT BAR ===== */}
      {showPromptBar && (
        <div className="px-4 py-3 flex-shrink-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
          <div className="flex gap-2 items-center bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20">
            <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
              placeholder="Descreva a imagem em inglês..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
            />
            <button onClick={handleGenerateImage} disabled={!aiPrompt.trim() || imageLoading}
              className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-xl disabled:opacity-40 transition-all active:scale-95 flex-shrink-0">
              Criar
            </button>
          </div>
        </div>
      )}

      {/* ===== BOTTOM TOOLBAR ===== */}
      <div className="flex-shrink-0 pb-safe" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>

        {/* Suggestions strip */}
        {suggestions.length > 0 && (
          <div className="flex gap-2 px-4 mb-3 overflow-x-auto scrollbar-hide">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => addLayer(s)}
                className="flex-shrink-0 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20 whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Main toolbar */}
        <div className="flex items-center justify-between px-6">

          {/* LEFT: Image tools */}
          <div className="flex items-center gap-3">
            {/* Upload */}
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 active:scale-95 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-white/70 text-[10px]">Upload</span>
            </label>

            {/* IA */}
            <button onClick={() => setShowPromptBar(p => !p)} className="flex flex-col items-center gap-1">
              <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm flex items-center justify-center border transition-all active:scale-95 ${showPromptBar ? 'bg-white/30 border-white/50' : 'bg-white/15 border-white/20'}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-white/70 text-[10px]">IA</span>
            </button>

            {/* Remix */}
            {imageSrc && (
              <button onClick={handleRemix} disabled={remixLoading} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 active:scale-95 transition-transform disabled:opacity-40">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-white/70 text-[10px]">Recriar</span>
              </button>
            )}
          </div>

          {/* CENTER: Add text */}
          {imageSrc && (
            <button onClick={() => addLayer('Texto')}
              className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-white/70 text-[10px]">Texto</span>
            </button>
          )}

          {/* RIGHT: Text style tools */}
          <div className="flex items-center gap-3">
            {/* Sugestões IA */}
            {imageSrc && aiPrompt && (
              <button onClick={handleGetSuggestions} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 active:scale-95 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <span className="text-white/70 text-[10px]">Ideias</span>
              </button>
            )}

            {/* Editar texto selecionado */}
            {selectedLayer && (
              <>
                <button onClick={() => setActivePanel(p => p === 'text' ? null : 'text')}
                  className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm flex items-center justify-center border transition-all active:scale-95 ${activePanel === 'text' ? 'bg-white/30 border-white/50' : 'bg-white/15 border-white/20'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-[10px]">Editar</span>
                </button>

                <button onClick={() => setActivePanel(p => p === 'style' ? null : 'style')}
                  className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-2xl backdrop-blur-sm flex items-center justify-center border transition-all active:scale-95 ${activePanel === 'style' ? 'bg-white/30 border-white/50' : 'bg-white/15 border-white/20'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-[10px]">Estilo</span>
                </button>

                <button onClick={() => deleteLayer(selectedId!)} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/30 backdrop-blur-sm flex items-center justify-center border border-red-400/30 active:scale-95 transition-transform">
                    <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span className="text-red-300/70 text-[10px]">Apagar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== PANEL: EDITAR TEXTO ===== */}
      {activePanel === 'text' && selectedLayer && (
        <div className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl overflow-hidden"
          style={{ background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(20px)' }}>
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mt-3 mb-4" />

          <div className="px-5 pb-8 space-y-4">
            {/* Input de texto */}
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider font-bold mb-2 block">Texto</label>
              <input
                type="text"
                value={editingText}
                onChange={(e) => {
                  setEditingText(e.target.value);
                  updateLayer(selectedLayer.id, 'text', e.target.value);
                }}
                className="w-full bg-white/10 text-white rounded-2xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-white/30"
                placeholder="Digite o texto..."
              />
            </div>

            {/* Tamanho */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Tamanho</label>
                <span className="text-xs text-white/70 font-bold">{selectedLayer.fontSize}px</span>
              </div>
              <input type="range" min="16" max="200" value={selectedLayer.fontSize}
                onChange={(e) => updateLayer(selectedLayer.id, 'fontSize', Number(e.target.value))}
                className="w-full accent-white" />
            </div>

            {/* Fonte */}
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider font-bold mb-2 block">Fonte</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {FONTS.map(f => (
                  <button key={f.value} onClick={() => updateLayer(selectedLayer.id, 'fontFamily', f.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all ${selectedLayer.fontFamily === f.value ? 'bg-white text-black font-bold' : 'bg-white/10 text-white'}`}
                    style={{ fontFamily: f.value }}>
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bold / Italic */}
            <div className="flex gap-3">
              <button onClick={() => updateLayer(selectedLayer.id, 'isBold', !selectedLayer.isBold)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${selectedLayer.isBold ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                <strong>B</strong>
              </button>
              <button onClick={() => updateLayer(selectedLayer.id, 'isItalic', !selectedLayer.isItalic)}
                className={`flex-1 py-2.5 rounded-2xl text-sm transition-all ${selectedLayer.isItalic ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                <em>I</em>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PANEL: ESTILO ===== */}
      {activePanel === 'style' && selectedLayer && (
        <div className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl overflow-hidden"
          style={{ background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(20px)' }}>
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mt-3 mb-4" />

          <div className="px-5 pb-8 space-y-5">
            {/* Cor do texto */}
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider font-bold mb-3 block">Cor do Texto</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button key={c} onClick={() => updateLayer(selectedLayer.id, 'color', c)}
                    className="w-9 h-9 rounded-full border-2 transition-all active:scale-90"
                    style={{ backgroundColor: c, borderColor: selectedLayer.color === c ? 'white' : 'transparent' }} />
                ))}
                <label className="w-9 h-9 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400">
                  <input type="color" value={selectedLayer.color} onChange={(e) => updateLayer(selectedLayer.id, 'color', e.target.value)} className="opacity-0 absolute" />
                  <svg className="w-4 h-4 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>
            </div>

            {/* Fundo */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Fundo</label>
                <button onClick={() => updateLayer(selectedLayer.id, 'backgroundColor', selectedLayer.backgroundColor === 'transparent' ? '#000000' : 'transparent')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedLayer.backgroundColor !== 'transparent' ? 'bg-red-500/30 text-red-300 border border-red-500/30' : 'bg-white/10 text-white/60'}`}>
                  {selectedLayer.backgroundColor !== 'transparent' ? 'Remover' : 'Sem fundo'}
                </button>
              </div>
              {selectedLayer.backgroundColor !== 'transparent' && (
                <div className="flex gap-2 flex-wrap">
                  {[...PRESET_COLORS, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.3)'].map((c, i) => (
                    <button key={i} onClick={() => updateLayer(selectedLayer.id, 'backgroundColor', c)}
                      className="w-9 h-9 rounded-full border-2 transition-all active:scale-90"
                      style={{ backgroundColor: c, borderColor: selectedLayer.backgroundColor === c ? 'white' : 'transparent' }} />
                  ))}
                  <label className="w-9 h-9 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-400 to-blue-400">
                    <input type="color" value={selectedLayer.backgroundColor === 'transparent' ? '#000000' : selectedLayer.backgroundColor}
                      onChange={(e) => updateLayer(selectedLayer.id, 'backgroundColor', e.target.value)} className="opacity-0 absolute" />
                    <svg className="w-4 h-4 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                </div>
              )}
            </div>

            {/* Borda */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Borda</label>
                <span className="text-xs text-white/70">{selectedLayer.borderWidth}px</span>
              </div>
              <input type="range" min="0" max="8" step="1" value={selectedLayer.borderWidth}
                onChange={(e) => updateLayer(selectedLayer.id, 'borderWidth', Number(e.target.value))}
                className="w-full accent-white mb-3" />
              {selectedLayer.borderWidth > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => updateLayer(selectedLayer.id, 'borderColor', c)}
                      className="w-9 h-9 rounded-full border-2 transition-all active:scale-90"
                      style={{ backgroundColor: c, borderColor: selectedLayer.borderColor === c ? 'white' : 'transparent' }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};