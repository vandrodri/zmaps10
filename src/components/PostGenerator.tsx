import React, { useState, useRef, useEffect } from 'react';
import { generatePost, generateAiImage, remixImage, generateImageOverlays } from '../services/groqService';
import { PostResult } from '../types';
import { GBPQuickAccessButton } from './GBPQuickAccessButton';

// --- CONFIGURAÇÕES DO EDITOR DE IMAGEM ---
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
}

interface LogoElement {
  id: number;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const FONTS = [
  { name: 'Padrão', value: 'Inter, sans-serif' },
  { name: 'Lobster (Cursiva)', value: '"Lobster", cursive' },
  { name: 'Oswald (Impacto)', value: '"Oswald", sans-serif' },
  { name: 'Playfair (Elegante)', value: '"Playfair Display", serif' },
  { name: 'Roboto (Moderna)', value: '"Roboto", sans-serif' },
];

export const PostGenerator: React.FC = () => {
  // --- ESTADOS DE GERAÇÃO DE TEXTO ---
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [platform, setPlatform] = useState('Google Business Profile');
  const [textLoading, setTextLoading] = useState(false);
  const [postResult, setPostResult] = useState<PostResult | null>(null);
  const [editableContent, setEditableContent] = useState('');

  // --- ESTADOS DO EDITOR DE IMAGEM ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [remixLoading, setRemixLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Sugestões de Overlay
  const [overlaySuggestions, setOverlaySuggestions] = useState<string[]>([]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // 🆕 LOGO
  const [logo, setLogo] = useState<LogoElement | null>(null);
  const [selectedLogo, setSelectedLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  
  // Preview
  const [showImagePreview, setShowImagePreview] = useState(false);

  // --- FUNÇÕES DE TEXTO ---
  const handleGenerateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setTextLoading(true);
    try {
      const data = await generatePost(topic, tone, platform);
      setPostResult(data);
      setEditableContent(data.content); 
      if (data.imagePrompt) {
        setAiPrompt(data.imagePrompt);
      }
      handleGenerateOverlays();
    } catch (error) {
      alert("Erro ao gerar post");
    } finally {
      setTextLoading(false);
    }
  };

  const handleGenerateOverlays = async () => {
    if (!topic) return;
    setOverlayLoading(true);
    try {
        const suggestions = await generateImageOverlays(topic);
        setOverlaySuggestions(suggestions);
    } catch (e) {
        console.error(e);
    } finally {
        setOverlayLoading(false);
    }
  };

  // --- FUNÇÕES DE IMAGEM & EDITOR ---
  const addText = (initialText = 'Novo Texto', fontSize = 40, isBold = true) => {
    const newText: TextElement = {
      id: Date.now(),
      text: initialText,
      x: 150,
      y: 150,
      color: '#ffffff',
      backgroundColor: 'transparent',
      fontSize: fontSize,
      fontFamily: 'Inter, sans-serif',
      rotation: 0,
      isBold: isBold,
      isItalic: false,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setTexts([]);
      setLogo(null);
    }
  };

  // 🆕 UPLOAD DE LOGO
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Redimensiona automaticamente para caber bem na imagem
        const maxSize = 150;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (maxSize / width) * height;
            width = maxSize;
          } else {
            width = (maxSize / height) * width;
            height = maxSize;
          }
        }
        
        setLogo({
          id: Date.now(),
          src: event.target?.result as string,
          x: 50,
          y: 50,
          width,
          height
        });
        setSelectedLogo(true);
        setSelectedTextId(null);
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
      setTexts([]);
      setLogo(null);
    } catch (error) {
      alert("Erro ao gerar imagem.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemixImage = async () => {
    if (!imageSrc) return;
    setRemixLoading(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas não disponível");
      
      const currentBase64 = canvas.toDataURL('image/png');
      const remixedBase64 = await remixImage(currentBase64, aiPrompt || "Make it photorealistic and professional");
      
      setImageSrc(remixedBase64);
    } catch (error) {
      alert("Erro ao recriar imagem com IA.");
    } finally {
      setRemixLoading(false);
    }
  };

  const openGoogleImages = () => {
    if (!topic && !aiPrompt) {
        alert("Gere um texto ou defina um tema primeiro.");
        return;
    }
    const query = aiPrompt ? aiPrompt.split(',')[0] : topic;
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
  };

  // --- LÓGICA DO CANVAS ---
  const drawCanvas = (canvas: HTMLCanvasElement | null = canvasRef.current) => {
    if (!canvas || !imageSrc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Desenha logo
        if (logo) {
          const logoImg = new Image();
          logoImg.src = logo.src;
          logoImg.onload = () => {
            ctx.drawImage(logoImg, logo.x, logo.y, logo.width, logo.height);
            
            // Borda de seleção do logo
            if (selectedLogo) {
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(logo.x, logo.y, logo.width, logo.height);
              
              // Handle de resize (canto inferior direito)
              ctx.fillStyle = '#3b82f6';
              ctx.fillRect(logo.x + logo.width - 8, logo.y + logo.height - 8, 16, 16);
            }
            
            // Desenha textos após logo
            drawTexts(ctx);
          };
        } else {
          drawTexts(ctx);
        }
    };
  };

  const drawTexts = (ctx: CanvasRenderingContext2D) => {
    texts.forEach(textEl => {
        ctx.save();
        const fontStyle = textEl.isItalic ? 'italic' : 'normal';
        const fontWeight = textEl.isBold ? 'bold' : 'normal';
        ctx.font = `${fontStyle} ${fontWeight} ${textEl.fontSize}px ${textEl.fontFamily}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        ctx.translate(textEl.x, textEl.y);
        ctx.rotate((textEl.rotation * Math.PI) / 180);

        if (textEl.backgroundColor !== 'transparent') {
            const metrics = ctx.measureText(textEl.text);
            const bgHeight = textEl.fontSize * 1.2;
            const bgWidth = metrics.width + 20;
            ctx.fillStyle = textEl.backgroundColor;
            ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);
        }

        ctx.fillStyle = textEl.color;
        if (textEl.backgroundColor === 'transparent') {
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fillText(textEl.text, 0, 0);

        if (selectedTextId === textEl.id) {
             const metrics = ctx.measureText(textEl.text);
             ctx.strokeStyle = '#3b82f6';
             ctx.lineWidth = 2;
             ctx.setLineDash([5, 5]);
             const boxWidth = metrics.width + 30;
             const boxHeight = textEl.fontSize * 1.4;
             ctx.strokeRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);
        }
        ctx.restore();
    });
  };

  useEffect(() => {
    if (imageSrc) {
        drawCanvas();
    }
  }, [imageSrc, texts, selectedTextId, logo, selectedLogo]);

  // 🆕 UseEffect para o preview canvas (SEMPRE no topo, nunca condicional)
  useEffect(() => {
    if (showImagePreview && previewCanvasRef.current) {
      drawCanvas(previewCanvasRef.current);
    }
  }, [showImagePreview, texts, logo, selectedTextId, selectedLogo, imageSrc]);

  // 🆕 UseEffect para esconder header no preview
  useEffect(() => {
    if (showImagePreview) {
      // Esconde header e aplica overflow hidden
      document.body.style.overflow = 'hidden';
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      if (header) (header as HTMLElement).style.display = 'none';
      if (nav) (nav as HTMLElement).style.display = 'none';
    } else {
      // Restaura header e overflow
      document.body.style.overflow = '';
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      if (header) (header as HTMLElement).style.display = '';
      if (nav) (nav as HTMLElement).style.display = '';
    }
    
    // Cleanup ao desmontar
    return () => {
      document.body.style.overflow = '';
      const header = document.querySelector('header');
      const nav = document.querySelector('nav');
      if (header) (header as HTMLElement).style.display = '';
      if (nav) (nav as HTMLElement).style.display = '';
    };
  }, [showImagePreview]);

  // 🆕 FUNÇÕES UNIVERSAIS (Mouse + Touch)
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, canvasEl: HTMLCanvasElement = canvasRef.current!) => {
    if (!canvasEl) return;
    
    const pos = getPos(e, canvasEl);
    
    // Verifica clique no handle de resize do logo
    if (logo && selectedLogo) {
      const handleX = logo.x + logo.width - 8;
      const handleY = logo.y + logo.height - 8;
      if (pos.x >= handleX && pos.x <= handleX + 16 && pos.y >= handleY && pos.y <= handleY + 16) {
        setIsResizingLogo(true);
        setDragStart({ x: pos.x, y: pos.y });
        return;
      }
    }
    
    // Verifica clique no logo
    if (logo && pos.x >= logo.x && pos.x <= logo.x + logo.width && pos.y >= logo.y && pos.y <= logo.y + logo.height) {
      setSelectedLogo(true);
      setSelectedTextId(null);
      setIsDragging(true);
      setDragStart({ x: pos.x - logo.x, y: pos.y - logo.y });
      return;
    }
    
    // Verifica clique em texto
    const clickedText = [...texts].reverse().find(t => {
        const dist = Math.sqrt(Math.pow(pos.x - t.x, 2) + Math.pow(pos.y - t.y, 2));
        return dist < (t.fontSize * 2); 
    });

    if (clickedText) {
        setSelectedTextId(clickedText.id);
        setSelectedLogo(false);
        setIsDragging(true);
        setDragStart({ x: pos.x - clickedText.x, y: pos.y - clickedText.y });
    } else {
        setSelectedTextId(null);
        setSelectedLogo(false);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent, canvasEl: HTMLCanvasElement = canvasRef.current!) => {
    if (!canvasEl) return;
    
    const pos = getPos(e, canvasEl);
    
    // Resize do logo
    if (isResizingLogo && logo) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      const newWidth = Math.max(50, logo.width + deltaX);
      const newHeight = Math.max(50, logo.height + deltaY);
      
      setLogo({ ...logo, width: newWidth, height: newHeight });
      setDragStart({ x: pos.x, y: pos.y });
      return;
    }
    
    // Drag do logo
    if (isDragging && selectedLogo && logo) {
      setLogo({ ...logo, x: pos.x - dragStart.x, y: pos.y - dragStart.y });
      return;
    }
    
    // Drag de texto
    if (isDragging && selectedTextId !== null) {
        setTexts(texts.map(t => {
            if (t.id === selectedTextId) {
                return { ...t, x: pos.x - dragStart.x, y: pos.y - dragStart.y };
            }
            return t;
        }));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizingLogo(false);
  };

  const updateSelectedText = (key: keyof TextElement, value: any) => {
    if (selectedTextId === null) return;
    setTexts(texts.map(t => t.id === selectedTextId ? { ...t, [key]: value } : t));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'post-gbp-pro.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  };

  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="animate-fade-in flex flex-col xl:grid xl:grid-cols-2 gap-8 xl:h-[calc(100vh-8rem)]">
      
      {/* COLUNA ESQUERDA: GERAÇÃO DE TEXTO */}
      <div className="flex flex-col space-y-6 overflow-y-auto pr-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-purple-600">✍️</span> Copywriter IA
            </h2>
            <form onSubmit={handleGenerateText} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tema</label>
                    <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Promoção de pizza..."
                    className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-400"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tom</label>
                        <select 
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none"
                        >
                            <option>Profissional</option>
                            <option>Divertido</option>
                            <option>Urgente</option>
                            <option>Empático</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Plataforma</label>
                        <select 
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full p-2 border border-slate-700 bg-slate-900 text-white rounded-lg outline-none"
                        >
                            <option>GBP</option>
                            <option>Instagram</option>
                            <option>LinkedIn</option>
                        </select>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={textLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
                >
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
                
                <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full p-4 border border-slate-700 bg-slate-900 text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-4 min-h-[150px] placeholder-slate-400"
                    placeholder="O texto gerado aparecerá aqui..."
                />
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {postResult.hashtags?.map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                     <button 
                        onClick={() => navigator.clipboard.writeText(editableContent)}
                        className="text-sm text-purple-600 font-semibold hover:bg-purple-50 px-3 py-1 rounded flex items-center gap-1 transition-colors border border-purple-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        Copiar Texto
                    </button>

                    <button 
                        onClick={handleAiGenerateImage}
                        disabled={imageLoading || !aiPrompt}
                        className="text-sm text-pink-600 font-semibold hover:bg-pink-50 px-3 py-1 rounded flex items-center gap-1 transition-colors border border-pink-200"
                    >
                         {imageLoading ? (
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                             <span>🎨</span>
                        )}
                        Gerar Imagem Sugerida
                    </button>
                </div>
                                <GBPQuickAccessButton variant="primary" className="mt-4" />

            </div>
        )}
      </div>
    
      {/* COLUNA DIREITA: EDITOR VISUAL */}
      <div className="flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
        
        {/* Toolbar Superior do Editor */}
        <div className="bg-white p-4 border-b border-slate-200 space-y-4 overflow-y-auto max-h-[300px]">
             <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-pink-600">🎨</span> Designer
                 </h2>
                 <button 
                    onClick={openGoogleImages}
                    className="text-xs bg-white border border-slate-300 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1"
                 >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    Buscar Referência
                 </button>
             </div>
             
             {/* Controles de Imagem */}
             <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Imagem via IA</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Descreva a imagem..."
                            className="flex-1 text-xs p-2 border border-slate-700 bg-slate-900 text-white rounded-lg shadow-inner outline-none placeholder-slate-400"
                        />
                        <button 
                            onClick={handleAiGenerateImage}
                            disabled={imageLoading || !aiPrompt}
                            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-pink-700 disabled:opacity-50 shadow-lg whitespace-nowrap transition-all hover:shadow-xl"
                        >
                            {imageLoading ? '...' : 'Criar'}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 text-center">Ou Upload</label>
                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            id="file-upload"
                            className="hidden"
                        />
                        <label 
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-md hover:shadow-lg transition-all"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Escolher Arquivo
                        </label>
                    </div>
                </div>
             </div>

             {/* 🆕 UPLOAD DE LOGO */}
             {imageSrc && (
               <div className="bg-blue-50 p-2 rounded border border-blue-100">
                 <label className="flex items-center justify-between cursor-pointer">
                   <span className="text-xs font-bold text-blue-800">
                     {logo ? '✅ Logo Adicionada' : '+ Adicionar Logo'}
                   </span>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleLogoUpload}
                     className="hidden"
                   />
                   <span className="text-xs text-blue-600 underline">
                     {logo ? 'Trocar' : 'Upload'}
                   </span>
                 </label>
                 {logo && (
                   <button 
                     onClick={() => setLogo(null)}
                     className="text-xs text-red-500 mt-1 hover:underline"
                   >
                     Remover Logo
                   </button>
                 )}
               </div>
             )}

             {/* Botão de Remix */}
             {imageSrc && (
                <div className="bg-purple-50 p-2 rounded border border-purple-100 flex items-center justify-between">
                    <div className="text-xs text-purple-800">
                        <strong>Anti-Copyright:</strong> Recrie com IA
                    </div>
                    <button 
                        onClick={handleRemixImage}
                        disabled={remixLoading}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-purple-700 disabled:opacity-50"
                    >
                        {remixLoading ? 'Recriando...' : '✨ Recriar'}
                    </button>
                </div>
             )}

             <div className="border-t border-slate-100 pt-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Sugestões de Texto (IA)</span>
                    <button onClick={handleGenerateOverlays} className="text-xs text-blue-500 hover:underline">
                         {overlayLoading ? 'Gerando...' : 'Atualizar'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {overlaySuggestions.map((text, idx) => (
                         <button 
                            key={idx}
                            onClick={() => addText(text, 50, true)}
                            className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-blue-50 hover:border-blue-200"
                         >
                            {text}
                         </button>
                    ))}
                </div>
             </div>

             {/* Controles de Texto SELECIONADO */}
             {selectedText && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600 uppercase">Editando Texto</span>
                        <button onClick={() => setTexts(texts.filter(t => t.id !== selectedTextId))} className="text-red-500 hover:bg-red-100 p-1 rounded text-xs">🗑️</button>
                    </div>

                    <input 
                        value={selectedText.text}
                        onChange={(e) => updateSelectedText('text', e.target.value)}
                        className="w-full border border-slate-700 bg-slate-900 text-white rounded text-sm p-2"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Tamanho: {selectedText.fontSize}px</label>
                             <input 
                                type="range" 
                                min="10" max="150"
                                value={selectedText.fontSize} 
                                onChange={(e) => updateSelectedText('fontSize', Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Rotação: {selectedText.rotation}°</label>
                             <input 
                                type="range" 
                                min="0" max="360"
                                value={selectedText.rotation} 
                                onChange={(e) => updateSelectedText('rotation', Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                         <input 
                            type="color" 
                            value={selectedText.color}
                            onChange={(e) => updateSelectedText('color', e.target.value)}
                            className="w-8 h-8"
                        />
                         <input 
                            type="color" 
                            value={selectedText.backgroundColor === 'transparent' ? '#000000' : selectedText.backgroundColor}
                            onChange={(e) => updateSelectedText('backgroundColor', e.target.value)}
                            className="w-8 h-8"
                        />
                         <button 
                            onClick={() => updateSelectedText('backgroundColor', selectedText.backgroundColor === 'transparent' ? '#000000' : 'transparent')}
                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                        >
                            Sem Fundo
                        </button>
                         <button 
                            onClick={() => updateSelectedText('isBold', !selectedText.isBold)} 
                            className={`text-xs px-3 py-1 rounded font-bold ${selectedText.isBold ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                        >
                            B
                        </button>
                         <select 
                            value={selectedText.fontFamily}
                            onChange={(e) => updateSelectedText('fontFamily', e.target.value)}
                            className="border bg-slate-900 text-white rounded text-xs p-1"
                        >
                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.name.split(' ')[0]}</option>)}
                        </select>
                    </div>
                </div>
             )}
        </div>

        {/* Área do Canvas */}
        <div className="flex-1 bg-slate-200 overflow-hidden flex items-center justify-center relative p-4">
             {!imageSrc ? (
                <div className="text-center text-slate-400">
                    <p>Gere, busque ou faça upload de uma imagem.</p>
                </div>
            ) : (
                <canvas
                  ref={canvasRef}
                  onMouseDown={(e) => handleStart(e)}
                  onMouseMove={(e) => handleMove(e)}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={(e) => handleStart(e)}
                  onTouchMove={(e) => handleMove(e)}
                  onTouchEnd={handleEnd}
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
            )}
            
            {/* Botões Flutuantes */}
            {imageSrc && (
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                 {/* 🆕 Botão Expandir */}
                 <button 
                    onClick={() => setShowImagePreview(true)}
                    className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg text-sm font-bold hover:bg-slate-50 border border-slate-200 flex items-center gap-2"
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Expandir
                 </button>
                 
                 <div className="flex gap-2">
                    <button 
                        onClick={() => addText('TÍTULO', 60, true)}
                        className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg font-extrabold text-sm hover:bg-slate-50 border border-slate-200"
                    >
                        + TÍTULO
                    </button>
                    <button 
                        onClick={() => addText('Legenda', 30, false)}
                        className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg text-sm hover:bg-slate-50 border border-slate-200"
                    >
                        + Legenda
                    </button>
                 </div>
                 
                <button 
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm hover:bg-blue-700"
                >
                    Baixar Imagem
                </button>
              </div>
            )}
        </div>
      </div>

      {/* 🆕 Modal de Preview MELHORADO (com drag + X funcional) */}
      {showImagePreview && imageSrc && (
        <div 
          className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-6"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* 🆕 Botão X no canto superior direito */}
          <button
            onClick={() => setShowImagePreview(false)}
            className="fixed top-6 right-6 bg-white/90 rounded-full p-3 shadow-xl hover:bg-white transition-all z-[100000]"
            style={{ position: 'fixed' }}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Canvas no modal com drag funcionando */}
          <canvas
            ref={previewCanvasRef}
            onMouseDown={(e) => handleStart(e, previewCanvasRef.current!)}
            onMouseMove={(e) => handleMove(e, previewCanvasRef.current!)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e, previewCanvasRef.current!)}
            onTouchMove={(e) => handleMove(e, previewCanvasRef.current!)}
            onTouchEnd={handleEnd}
            className="max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] object-contain"
          />
        </div>
      )}
    </div>
  );
};