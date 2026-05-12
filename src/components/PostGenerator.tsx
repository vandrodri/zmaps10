import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generatePost, generateAiImage, remixImage, generateImageOverlays } from '../services/groqService';
import { PostResult } from '../types';
import { GBPQuickAccessButton } from './GBPQuickAccessButton';

// --- TIPOS ---
interface TextElement {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  rotation: number;
  isBold: boolean;
  isItalic: boolean;
  borderColor?: string;
  borderWidth?: number;
}

interface LogoElement {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const MOBILE_TITLE_ID = 1;
const MOBILE_CAPTION_ID = 2;

const FONTS = [
  { name: 'Padrão', value: 'Inter, sans-serif' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Playfair', value: '"Playfair Display", serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
];

export const PostGenerator: React.FC = () => {
  // --- ESTADOS DE TEXTO ---
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [platform, setPlatform] = useState('Google Business Profile');
  const [textLoading, setTextLoading] = useState(false);
  const [postResult, setPostResult] = useState<PostResult | null>(null);
  const [editableContent, setEditableContent] = useState('');

  // --- ESTADOS DO EDITOR ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [remixLoading, setRemixLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [overlaySuggestions, setOverlaySuggestions] = useState<string[]>([]);
  const [overlayLoading, setOverlayLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [logo, setLogo] = useState<LogoElement | null>(null);
  const [selectedLogo, setSelectedLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // --- ESTADOS MOBILE ---
  const [mobileEditorTab, setMobileEditorTab] = useState<'image' | 'texts'>('image');

  // Título mobile
  const [mobileTitleText, setMobileTitleText] = useState('');
  const [mobileTitleSize, setMobileTitleSize] = useState(60);
  const [mobileTitleColor, setMobileTitleColor] = useState('#ffffff');
  const [mobileTitleBold, setMobileTitleBold] = useState(true);
  const [mobileTitleFont, setMobileTitleFont] = useState('Inter, sans-serif');
  const [mobileTitlePos, setMobileTitlePos] = useState<'top' | 'center' | 'bottom'>('top');
  const [mobileTitleBg, setMobileTitleBg] = useState('transparent');
  const [mobileTitleBorderColor, setMobileTitleBorderColor] = useState('#000000');
  const [mobileTitleBorderWidth, setMobileTitleBorderWidth] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  // Legenda mobile
  const [mobileCaptionText, setMobileCaptionText] = useState('');
  const [mobileCaptionSize, setMobileCaptionSize] = useState(28);
  const [mobileCaptionColor, setMobileCaptionColor] = useState('#ffffff');
  const [mobileCaptionBold, setMobileCaptionBold] = useState(false);
  const [mobileCaptionFont, setMobileCaptionFont] = useState('Inter, sans-serif');
  const [mobileCaptionPos, setMobileCaptionPos] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [mobileCaptionBg, setMobileCaptionBg] = useState('transparent');
  const [mobileCaptionBorderColor, setMobileCaptionBorderColor] = useState('#000000');
  const [mobileCaptionBorderWidth, setMobileCaptionBorderWidth] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  // --- APPLY MOBILE TEXTS ---
  const applyMobileTexts = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width || 800;
    const h = canvas.height || 600;
    const getPosY = (pos: 'top' | 'center' | 'bottom', size: number) =>
      pos === 'top' ? size * 1.5 : pos === 'bottom' ? h - size * 1.5 : h / 2;

    setTexts(prev => {
      let next = prev.filter(t => t.id !== MOBILE_TITLE_ID && t.id !== MOBILE_CAPTION_ID);
      if (showTitle && mobileTitleText.trim()) {
        next = [...next, {
          id: MOBILE_TITLE_ID,
          text: mobileTitleText,
          x: w / 2,
          y: getPosY(mobileTitlePos, mobileTitleSize),
          color: mobileTitleColor,
          backgroundColor: mobileTitleBg,
          fontSize: mobileTitleSize,
          fontFamily: mobileTitleFont,
          rotation: 0,
          isBold: mobileTitleBold,
          isItalic: false,
          borderColor: mobileTitleBorderColor,
          borderWidth: mobileTitleBorderWidth,
        }];
      }
      if (showCaption && mobileCaptionText.trim()) {
        next = [...next, {
          id: MOBILE_CAPTION_ID,
          text: mobileCaptionText,
          x: w / 2,
          y: getPosY(mobileCaptionPos, mobileCaptionSize),
          color: mobileCaptionColor,
          backgroundColor: mobileCaptionBg,
          fontSize: mobileCaptionSize,
          fontFamily: mobileCaptionFont,
          rotation: 0,
          isBold: mobileCaptionBold,
          isItalic: false,
          borderColor: mobileCaptionBorderColor,
          borderWidth: mobileCaptionBorderWidth,
        }];
      }
      return next;
    });
  }, [
    showTitle, mobileTitleText, mobileTitleSize, mobileTitleColor, mobileTitleBold, mobileTitleFont, mobileTitlePos, mobileTitleBg, mobileTitleBorderColor, mobileTitleBorderWidth,
    showCaption, mobileCaptionText, mobileCaptionSize, mobileCaptionColor, mobileCaptionBold, mobileCaptionFont, mobileCaptionPos, mobileCaptionBg, mobileCaptionBorderColor, mobileCaptionBorderWidth,
  ]);

  useEffect(() => {
    applyMobileTexts();
  }, [
    showTitle, mobileTitleSize, mobileTitleColor, mobileTitleBold, mobileTitleFont, mobileTitlePos, mobileTitleBg, mobileTitleBorderColor, mobileTitleBorderWidth,
    showCaption, mobileCaptionSize, mobileCaptionColor, mobileCaptionBold, mobileCaptionFont, mobileCaptionPos, mobileCaptionBg, mobileCaptionBorderColor, mobileCaptionBorderWidth,
  ]);

  // --- GERAÇÃO DE TEXTO ---
  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setTextLoading(true);
    try {
      const data = await generatePost(topic, tone, platform);
      setPostResult(data);
      setEditableContent(data.content);
      if (data.imagePrompt) setAiPrompt(data.imagePrompt);
      handleGenerateOverlays();
    } catch { alert('Erro ao gerar post'); }
    finally { setTextLoading(false); }
  };

  const handleGenerateOverlays = async () => {
    if (!topic) return;
    setOverlayLoading(true);
    try {
      const suggestions = await generateImageOverlays(topic);
      setOverlaySuggestions(suggestions);
    } catch (e) { console.error(e); }
    finally { setOverlayLoading(false); }
  };

  // --- EDITOR DESKTOP ---
  const addTextDesktop = (initialText = 'Novo Texto', fontSize = 40, isBold = true) => {
    const canvas = canvasRef.current;
    const newText: TextElement = {
      id: Date.now(),
      text: initialText,
      x: (canvas?.width || 400) / 2,
      y: (canvas?.height || 400) / 2,
      color: '#ffffff',
      backgroundColor: 'transparent',
      fontSize,
      fontFamily: 'Inter, sans-serif',
      rotation: 0,
      isBold,
      isItalic: false,
      borderColor: '#000000',
      borderWidth: 0,
    };
    setTexts(prev => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setTexts([]); setLogo(null);
      setShowTitle(false); setShowCaption(false);
      setMobileTitleText(''); setMobileCaptionText('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxSize = 150;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = (maxSize / width) * height; width = maxSize; }
          else { width = (maxSize / height) * width; height = maxSize; }
        }
        setLogo({ id: Date.now(), src: event.target?.result as string, x: 50, y: 50, width, height });
        setSelectedLogo(true); setSelectedTextId(null);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleAiGenerateImage = async () => {
    if (!aiPrompt) return;
    setImageLoading(true);
    try {
      const base64Image = await generateAiImage(aiPrompt);
      setImageSrc(base64Image);
      setTexts([]); setLogo(null);
      setShowTitle(false); setShowCaption(false);
      setMobileTitleText(''); setMobileCaptionText('');
    } catch { alert('Erro ao gerar imagem.'); }
    finally { setImageLoading(false); }
  };

  const handleRemixImage = async () => {
    if (!imageSrc) return;
    setRemixLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas não disponível');
      const remixedBase64 = await remixImage(canvas.toDataURL('image/png'), aiPrompt || 'Make it photorealistic and professional');
      setImageSrc(remixedBase64);
    } catch { alert('Erro ao recriar imagem com IA.'); }
    finally { setRemixLoading(false); }
  };

  const openGoogleImages = () => {
    if (!topic && !aiPrompt) { alert('Gere um texto ou defina um tema primeiro.'); return; }
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(aiPrompt ? aiPrompt.split(',')[0] : topic)}`, '_blank');
  };

  // --- CANVAS ---
  const drawCanvas = useCallback((canvas: HTMLCanvasElement | null = canvasRef.current) => {
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxWidth = 800;
      let { width, height } = img;
      if (width > maxWidth) { height = (maxWidth / width) * height; width = maxWidth; }
      canvas.width = width; canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const doDrawTexts = () => {
        texts.forEach(textEl => {
          ctx.save();
          ctx.font = `${textEl.isItalic ? 'italic' : 'normal'} ${textEl.isBold ? 'bold' : 'normal'} ${textEl.fontSize}px ${textEl.fontFamily}`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.translate(textEl.x, textEl.y);
          ctx.rotate((textEl.rotation * Math.PI) / 180);

          // Fundo
          if (textEl.backgroundColor && textEl.backgroundColor !== 'transparent') {
            const m = ctx.measureText(textEl.text);
            const padX = 16, padY = 8;
            ctx.fillStyle = textEl.backgroundColor;
            ctx.beginPath();
            const bx = -(m.width + padX * 2) / 2;
            const by = -(textEl.fontSize + padY * 2) / 2;
            const bw = m.width + padX * 2;
            const bh = textEl.fontSize + padY * 2;
            const r = 6;
            ctx.moveTo(bx + r, by);
            ctx.lineTo(bx + bw - r, by);
            ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
            ctx.lineTo(bx + bw, by + bh - r);
            ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
            ctx.lineTo(bx + r, by + bh);
            ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
            ctx.lineTo(bx, by + r);
            ctx.quadraticCurveTo(bx, by, bx + r, by);
            ctx.closePath();
            ctx.fill();
          }

          // Borda do texto — stroke antes do fill, proporcional ao fontSize
          if (textEl.borderWidth && textEl.borderWidth > 0) {
            ctx.shadowBlur = 0;
            ctx.strokeStyle = textEl.borderColor || '#000000';
            // Escala a espessura proporcional ao fontSize para consistência entre dispositivos
            const scaledBorder = (textEl.borderWidth / 100) * textEl.fontSize;
            ctx.lineWidth = Math.max(1, scaledBorder * 2);
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(textEl.text, 0, 0);
          }

          // Texto preenchido — cobre o interior da borda
          ctx.fillStyle = textEl.color;
          ctx.shadowColor = (!textEl.backgroundColor || textEl.backgroundColor === 'transparent') ? 'rgba(0,0,0,0.6)' : 'transparent';
          ctx.shadowBlur = (!textEl.backgroundColor || textEl.backgroundColor === 'transparent') ? 4 : 0;
          ctx.fillText(textEl.text, 0, 0);

          // Seleção (desktop)
          if (selectedTextId === textEl.id) {
            const m = ctx.measureText(textEl.text);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.strokeRect(-(m.width + 30) / 2, -(textEl.fontSize * 1.4) / 2, m.width + 30, textEl.fontSize * 1.4);
            ctx.setLineDash([]);
          }
          ctx.restore();
        });
      };

      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo.src;
        logoImg.onload = () => {
          ctx.drawImage(logoImg, logo.x, logo.y, logo.width, logo.height);
          if (selectedLogo) {
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.strokeRect(logo.x, logo.y, logo.width, logo.height);
            ctx.setLineDash([]);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(logo.x + logo.width - 8, logo.y + logo.height - 8, 16, 16);
          }
          doDrawTexts();
        };
      } else {
        doDrawTexts();
      }
    };
  }, [imageSrc, texts, selectedTextId, logo, selectedLogo]);

  useEffect(() => { if (imageSrc) drawCanvas(); }, [drawCanvas]);
  useEffect(() => { if (showImagePreview && previewCanvasRef.current) drawCanvas(previewCanvasRef.current); }, [showImagePreview, drawCanvas]);
  useEffect(() => {
    if (showImagePreview) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [showImagePreview]);

  // --- DRAG DESKTOP ---
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const src = 'touches' in e ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, canvasEl = canvasRef.current!) => {
    if (!canvasEl) return;
    const pos = getPos(e, canvasEl);
    if (logo && selectedLogo) {
      const hx = logo.x + logo.width - 8, hy = logo.y + logo.height - 8;
      if (pos.x >= hx && pos.x <= hx + 16 && pos.y >= hy && pos.y <= hy + 16) { setIsResizingLogo(true); setDragStart({ x: pos.x, y: pos.y }); return; }
    }
    if (logo && pos.x >= logo.x && pos.x <= logo.x + logo.width && pos.y >= logo.y && pos.y <= logo.y + logo.height) {
      setSelectedLogo(true); setSelectedTextId(null); setIsDragging(true);
      setDragStart({ x: pos.x - logo.x, y: pos.y - logo.y }); return;
    }
    const clicked = [...texts].reverse().find(t => Math.sqrt((pos.x - t.x) ** 2 + (pos.y - t.y) ** 2) < t.fontSize * 2);
    if (clicked) { setSelectedTextId(clicked.id); setSelectedLogo(false); setIsDragging(true); setDragStart({ x: pos.x - clicked.x, y: pos.y - clicked.y }); }
    else { setSelectedTextId(null); setSelectedLogo(false); }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent, canvasEl = canvasRef.current!) => {
    if (!canvasEl) return;
    const pos = getPos(e, canvasEl);
    if (isResizingLogo && logo) {
      const dx = pos.x - dragStart.x, dy = pos.y - dragStart.y;
      setLogo({ ...logo, width: Math.max(50, logo.width + dx), height: Math.max(50, logo.height + dy) });
      setDragStart({ x: pos.x, y: pos.y }); return;
    }
    if (isDragging && selectedLogo && logo) { setLogo({ ...logo, x: pos.x - dragStart.x, y: pos.y - dragStart.y }); return; }
    if (isDragging && selectedTextId !== null) {
      setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, x: pos.x - dragStart.x, y: pos.y - dragStart.y } : t));
    }
  };

  const handleEnd = () => { setIsDragging(false); setIsResizingLogo(false); };

  const updateSelectedText = (key: keyof TextElement, value: any) => {
    if (selectedTextId === null) return;
    setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, [key]: value } : t));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) { const link = document.createElement('a'); link.download = 'post-gbp-pro.png'; link.href = canvas.toDataURL('image/png'); link.click(); }
  };

  const selectedText = texts.find(t => t.id === selectedTextId);
  const getPosLabel = (pos: 'top' | 'center' | 'bottom') => pos === 'top' ? 'Topo' : pos === 'bottom' ? 'Base' : 'Centro';

  // --- COMPONENTE REUTILIZÁVEL: controles de fundo + borda ---
  const BgBorderControls = ({
    bg, onBgChange, onBgRemove,
    borderColor, onBorderColorChange,
    borderWidth, onBorderWidthChange,
    accentClass = 'accent-blue-600',
  }: {
    bg: string; onBgChange: (v: string) => void; onBgRemove: () => void;
    borderColor: string; onBorderColorChange: (v: string) => void;
    borderWidth: number; onBorderWidthChange: (v: number) => void;
    accentClass?: string;
  }) => (
    <div className="space-y-2.5 pt-1">
      {/* Fundo */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs text-slate-500 font-medium w-10">Fundo</label>
        <input
          type="color"
          value={bg === 'transparent' ? '#000000' : bg}
          onChange={(e) => onBgChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200 flex-shrink-0"
        />
        <button
          onClick={onBgRemove}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${bg === 'transparent' ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-600'}`}
        >
          {bg === 'transparent' ? 'Sem fundo' : 'Remover'}
        </button>
      </div>
      {/* Borda */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs text-slate-500 font-medium w-10">Borda</label>
        <input
          type="color"
          value={borderColor}
          onChange={(e) => onBorderColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-[80px]">
          <div className="flex justify-between mb-0.5">
            <span className="text-[10px] text-slate-400">Espessura</span>
            <span className="text-[10px] font-bold text-slate-600">{borderWidth}px</span>
          </div>
          <input
            type="range" min="0" max="10" step="1"
            value={borderWidth}
            onChange={(e) => onBorderWidthChange(Number(e.target.value))}
            className={`w-full ${accentClass}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col xl:grid xl:grid-cols-2 gap-8 xl:h-[calc(100vh-8rem)]">

      {/* COLUNA ESQUERDA: GERAÇÃO DE TEXTO */}
      <div className="flex flex-col space-y-6 overflow-y-auto pr-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Copywriter IA
          </h2>
          <form onSubmit={handleGenerateText} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tema</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Promoção de pizza..."
                className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tom</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none">
                  <option>Profissional</option><option>Divertido</option><option>Urgente</option><option>Empático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plataforma</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none">
                  <option>GBP</option><option>Instagram</option><option>LinkedIn</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={textLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50">
              {textLoading ? 'Escrevendo...' : 'Gerar Texto'}
            </button>
          </form>
        </div>

        {postResult && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Resultado (Editável)</h3>
              <span className="text-xs text-slate-400">Clique para editar</span>
            </div>
            <textarea value={editableContent} onChange={(e) => setEditableContent(e.target.value)}
              className="w-full p-4 border border-slate-700 bg-slate-900 text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-4 min-h-[150px] placeholder-slate-400"
              placeholder="O texto gerado aparecerá aqui..." />
            <div className="flex flex-wrap gap-2 mb-4">
              {postResult.hashtags?.map(tag => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => navigator.clipboard.writeText(editableContent)}
                className="text-sm text-purple-600 font-semibold hover:bg-purple-50 px-3 py-1 rounded flex items-center gap-1 transition-colors border border-purple-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Copiar Texto
              </button>
              <button onClick={handleAiGenerateImage} disabled={imageLoading || !aiPrompt}
                className="text-sm text-pink-600 font-semibold hover:bg-pink-50 px-3 py-1 rounded flex items-center gap-1 transition-colors border border-pink-200">
                {imageLoading
                  ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                }
                Gerar Imagem Sugerida
              </button>
            </div>
            <GBPQuickAccessButton variant="primary" className="mt-4" />
          </div>
        )}
      </div>

      {/* COLUNA DIREITA: EDITOR VISUAL */}
      <div className="flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">

        {/* ===== TOOLBAR DESKTOP ===== */}
        <div className="hidden md:block bg-white p-4 border-b border-slate-200 space-y-4 overflow-y-auto max-h-[320px]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Designer
            </h2>
            <button onClick={openGoogleImages} className="text-xs bg-white border border-slate-300 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              Buscar Referência
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Imagem via IA</label>
              <div className="flex gap-2">
                <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Descreva a imagem..."
                  className="flex-1 text-xs p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none placeholder-slate-400" />
                <button onClick={handleAiGenerateImage} disabled={imageLoading || !aiPrompt}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-pink-700 disabled:opacity-50 whitespace-nowrap">
                  {imageLoading ? '...' : 'Criar'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 text-center">Ou Upload</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} id="file-upload-desktop" className="hidden" />
              <label htmlFor="file-upload-desktop" className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                Escolher Arquivo
              </label>
            </div>
          </div>
          {imageSrc && (
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-blue-800">{logo ? '✅ Logo Adicionada' : '+ Adicionar Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <span className="text-xs text-blue-600 underline">{logo ? 'Trocar' : 'Upload'}</span>
              </label>
              {logo && <button onClick={() => setLogo(null)} className="text-xs text-red-500 mt-1 hover:underline">Remover Logo</button>}
            </div>
          )}
          {imageSrc && (
            <div className="bg-purple-50 p-2 rounded border border-purple-100 flex items-center justify-between">
              <div className="text-xs text-purple-800"><strong>Anti-Copyright:</strong> Recrie com IA</div>
              <button onClick={handleRemixImage} disabled={remixLoading} className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-purple-700 disabled:opacity-50">
                {remixLoading ? 'Recriando...' : 'Recriar'}
              </button>
            </div>
          )}
          <div className="border-t border-slate-100 pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Sugestões de Texto (IA)</span>
              <button onClick={handleGenerateOverlays} className="text-xs text-blue-500 hover:underline">{overlayLoading ? 'Gerando...' : 'Atualizar'}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {overlaySuggestions.map((text, idx) => (
                <button key={idx} onClick={() => addTextDesktop(text, 50, true)}
                  className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-blue-50 hover:border-blue-200">{text}</button>
              ))}
            </div>
          </div>

          {/* Painel de edição de texto selecionado - DESKTOP */}
          {selectedText && (
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase">Editando Texto</span>
                <button onClick={() => setTexts(prev => prev.filter(t => t.id !== selectedTextId))} className="text-red-500 hover:bg-red-100 p-1 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <input value={selectedText.text} onChange={(e) => updateSelectedText('text', e.target.value)}
                className="w-full border border-slate-700 bg-slate-900 text-white rounded text-sm p-2" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tamanho: {selectedText.fontSize}px</label>
                  <input type="range" min="10" max="150" value={selectedText.fontSize} onChange={(e) => updateSelectedText('fontSize', Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Rotação: {selectedText.rotation}°</label>
                  <input type="range" min="0" max="360" value={selectedText.rotation} onChange={(e) => updateSelectedText('rotation', Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>
              {/* Cor do texto + negrito + fonte */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-slate-400">Texto</label>
                  <input type="color" value={selectedText.color} onChange={(e) => updateSelectedText('color', e.target.value)} className="w-8 h-8" />
                </div>
                <button onClick={() => updateSelectedText('isBold', !selectedText.isBold)}
                  className={`text-xs px-3 py-1 rounded font-bold ${selectedText.isBold ? 'bg-blue-600 text-white' : 'bg-white border'}`}>B</button>
                <button onClick={() => updateSelectedText('isItalic', !selectedText.isItalic)}
                  className={`text-xs px-3 py-1 rounded italic ${selectedText.isItalic ? 'bg-blue-600 text-white' : 'bg-white border'}`}>I</button>
                <select value={selectedText.fontFamily} onChange={(e) => updateSelectedText('fontFamily', e.target.value)}
                  className="border bg-slate-900 text-white rounded text-xs p-1 flex-1">
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.name.split(' ')[0]}</option>)}
                </select>
              </div>
              {/* Fundo e borda - DESKTOP */}
              <div className="border-t border-slate-200 pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Fundo & Borda</p>
                <BgBorderControls
                  bg={selectedText.backgroundColor}
                  onBgChange={(v) => updateSelectedText('backgroundColor', v)}
                  onBgRemove={() => updateSelectedText('backgroundColor', 'transparent')}
                  borderColor={selectedText.borderColor || '#000000'}
                  onBorderColorChange={(v) => updateSelectedText('borderColor', v)}
                  borderWidth={selectedText.borderWidth || 0}
                  onBorderWidthChange={(v) => updateSelectedText('borderWidth', v)}
                  accentClass="accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* ===== TOOLBAR MOBILE ===== */}
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Editor de Imagem
            </h2>
          </div>
          {mobileEditorTab !== 'texts' && (
            <div className="px-4 pt-3 pb-4 space-y-2">
              <div className="flex gap-2">
                <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Descreva a imagem para IA..."
                  className="flex-1 text-sm p-2.5 border border-slate-300 rounded-xl outline-none text-slate-800 placeholder-slate-400" />
                <button onClick={handleAiGenerateImage} disabled={imageLoading || !aiPrompt}
                  className="bg-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 whitespace-nowrap">
                  {imageLoading ? '...' : 'Criar'}
                </button>
              </div>
              <div className="flex gap-2">
                <input type="file" accept="image/*" onChange={handleFileUpload} id="file-upload-mobile" className="hidden" />
                <label htmlFor="file-upload-mobile" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  Upload
                </label>
                {imageSrc && (
                  <button onClick={handleRemixImage} disabled={remixLoading}
                    className="flex items-center gap-1 px-3 py-2.5 bg-purple-100 text-purple-700 rounded-xl text-sm font-bold disabled:opacity-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {remixLoading ? '...' : 'Recriar'}
                  </button>
                )}
              </div>
            </div>
          )}
          {imageSrc && (
            <div className="flex border-t-2 border-slate-200 mt-1">
              <button onClick={() => setMobileEditorTab('image')}
                className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${mobileEditorTab === 'image' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-slate-500'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Imagem
              </button>
              <button onClick={() => setMobileEditorTab('texts')}
                className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${mobileEditorTab === 'texts' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                Textos
                {(showTitle || showCaption) && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {(showTitle ? 1 : 0) + (showCaption ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* CANVAS */}
        <div className={`flex-1 bg-slate-200 overflow-hidden flex items-center justify-center relative p-4 ${imageSrc && mobileEditorTab === 'texts' ? 'md:flex hidden' : 'flex'}`}>
          {!imageSrc ? (
            <div className="text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-sm">Gere, busque ou faça upload de uma imagem</p>
            </div>
          ) : (
            <canvas ref={canvasRef} onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
              className="max-w-full max-h-full object-contain shadow-lg" />
          )}
          {imageSrc && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button onClick={() => setShowImagePreview(true)}
                className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg text-sm font-bold hover:bg-slate-50 border border-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                Expandir
              </button>
              <div className="hidden md:flex gap-2">
                <button onClick={() => addTextDesktop('TÍTULO', 60, true)}
                  className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg font-extrabold text-sm hover:bg-slate-50 border border-slate-200">+ TÍTULO</button>
                <button onClick={() => addTextDesktop('Legenda', 30, false)}
                  className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg text-sm hover:bg-slate-50 border border-slate-200">+ Legenda</button>
              </div>
              <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm hover:bg-blue-700">
                Baixar Imagem
              </button>
            </div>
          )}
        </div>

        {/* ===== ABA TEXTOS MOBILE ===== */}
        {imageSrc && mobileEditorTab === 'texts' && (
          <div className="md:hidden flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">

            {/* TÍTULO */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                  <span className="font-bold text-sm text-slate-800">Título</span>
                </div>
                <button onClick={() => { const next = !showTitle; setShowTitle(next); if (!next) setMobileTitleText(''); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${showTitle ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {showTitle ? 'Ativo' : 'Adicionar'}
                </button>
              </div>
              {showTitle && (
                <div className="p-4 space-y-3">
                  <input type="text" value={mobileTitleText} onChange={(e) => setMobileTitleText(e.target.value)} onBlur={applyMobileTexts}
                    placeholder="Digite o título..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-slate-500 font-medium">Tamanho</label>
                      <span className="text-xs font-bold text-slate-700">{mobileTitleSize}px</span>
                    </div>
                    <input type="range" min="16" max="120" value={mobileTitleSize} onChange={(e) => setMobileTitleSize(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Posição</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['top', 'center', 'bottom'] as const).map(pos => (
                        <button key={pos} onClick={() => setMobileTitlePos(pos)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${mobileTitlePos === pos ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {getPosLabel(pos)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Cor + negrito + fonte */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-slate-500">Cor</label>
                      <input type="color" value={mobileTitleColor} onChange={(e) => setMobileTitleColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200" />
                    </div>
                    <button onClick={() => setMobileTitleBold(!mobileTitleBold)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mobileTitleBold ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>B</button>
                    <select value={mobileTitleFont} onChange={(e) => setMobileTitleFont(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg text-xs p-1.5 text-slate-700 focus:outline-none">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>
                  {/* Fundo e borda - MOBILE TÍTULO */}
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Fundo & Borda</p>
                    <BgBorderControls
                      bg={mobileTitleBg}
                      onBgChange={setMobileTitleBg}
                      onBgRemove={() => setMobileTitleBg('transparent')}
                      borderColor={mobileTitleBorderColor}
                      onBorderColorChange={setMobileTitleBorderColor}
                      borderWidth={mobileTitleBorderWidth}
                      onBorderWidthChange={setMobileTitleBorderWidth}
                      accentClass="accent-blue-600"
                    />
                  </div>
                  <button onClick={applyMobileTexts}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                    Aplicar na Imagem
                  </button>
                </div>
              )}
            </div>

            {/* LEGENDA */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" /></svg>
                  <span className="font-bold text-sm text-slate-800">Legenda</span>
                </div>
                <button onClick={() => { const next = !showCaption; setShowCaption(next); if (!next) setMobileCaptionText(''); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${showCaption ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {showCaption ? 'Ativo' : 'Adicionar'}
                </button>
              </div>
              {showCaption && (
                <div className="p-4 space-y-3">
                  <input type="text" value={mobileCaptionText} onChange={(e) => setMobileCaptionText(e.target.value)} onBlur={applyMobileTexts}
                    placeholder="Digite a legenda..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-slate-500 font-medium">Tamanho</label>
                      <span className="text-xs font-bold text-slate-700">{mobileCaptionSize}px</span>
                    </div>
                    <input type="range" min="12" max="80" value={mobileCaptionSize} onChange={(e) => setMobileCaptionSize(Number(e.target.value))} className="w-full accent-green-600" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Posição</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['top', 'center', 'bottom'] as const).map(pos => (
                        <button key={pos} onClick={() => setMobileCaptionPos(pos)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${mobileCaptionPos === pos ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {getPosLabel(pos)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs text-slate-500">Cor</label>
                      <input type="color" value={mobileCaptionColor} onChange={(e) => setMobileCaptionColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-200" />
                    </div>
                    <button onClick={() => setMobileCaptionBold(!mobileCaptionBold)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mobileCaptionBold ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'}`}>B</button>
                    <select value={mobileCaptionFont} onChange={(e) => setMobileCaptionFont(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg text-xs p-1.5 text-slate-700 focus:outline-none">
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>
                  {/* Fundo e borda - MOBILE LEGENDA */}
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Fundo & Borda</p>
                    <BgBorderControls
                      bg={mobileCaptionBg}
                      onBgChange={setMobileCaptionBg}
                      onBgRemove={() => setMobileCaptionBg('transparent')}
                      borderColor={mobileCaptionBorderColor}
                      onBorderColorChange={setMobileCaptionBorderColor}
                      borderWidth={mobileCaptionBorderWidth}
                      onBorderWidthChange={setMobileCaptionBorderWidth}
                      accentClass="accent-green-600"
                    />
                  </div>
                  <button onClick={applyMobileTexts}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                    Aplicar na Imagem
                  </button>
                </div>
              )}
            </div>

            {/* Sugestões IA */}
            {overlaySuggestions.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Sugestões IA</p>
                <div className="flex flex-wrap gap-2">
                  {overlaySuggestions.map((text, idx) => (
                    <button key={idx} onClick={() => { setMobileTitleText(text); setShowTitle(true); }}
                      className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg">{text}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DE PREVIEW */}
      {showImagePreview && imageSrc && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4">
          <div className="relative inline-flex">
            <canvas ref={previewCanvasRef}
              onMouseDown={(e) => handleStart(e, previewCanvasRef.current!)}
              onMouseMove={(e) => handleMove(e, previewCanvasRef.current!)}
              onMouseUp={handleEnd} onMouseLeave={handleEnd}
              className="max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] object-contain block" />
            <button onClick={() => setShowImagePreview(false)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};