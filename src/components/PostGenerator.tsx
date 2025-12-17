import React, { useState, useRef, useEffect } from 'react';
import { generatePost, generateAiImage, remixImage, generateImageOverlays } from '../services/groqService';
import { PostResult } from '../types';

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
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
      // Gera sugestões de overlay automaticamente ao gerar o texto
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
    }
  };

  const handleAiGenerateImage = async () => {
    if (!aiPrompt) return;
    setImageLoading(true);
    try {
      const base64Image = await generateAiImage(aiPrompt);
      setImageSrc(base64Image);
      setTexts([]);
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
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc || '';
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
  };

  useEffect(() => {
    if (imageSrc) {
        drawCanvas();
    }
  }, [imageSrc, texts, selectedTextId]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const clickedText = [...texts].reverse().find(t => {
        const dist = Math.sqrt(Math.pow(pos.x - t.x, 2) + Math.pow(pos.y - t.y, 2));
        return dist < (t.fontSize * 2); 
    });

    if (clickedText) {
        setSelectedTextId(clickedText.id);
        setIsDragging(true);
        setDragStart({ x: pos.x - clickedText.x, y: pos.y - clickedText.y });
    } else {
        setSelectedTextId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedTextId !== null) {
        const pos = getMousePos(e);
        setTexts(texts.map(t => {
            if (t.id === selectedTextId) {
                return { ...t, x: pos.x - dragStart.x, y: pos.y - dragStart.y };
            }
            return t;
        }));
    }
  };

  const handleMouseUp = () => { setIsDragging(false); };

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
    <div className="animate-fade-in grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      
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
                
                {/* Editor Manual do Post */}
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
                        title={aiPrompt ? `Gerar imagem com prompt: ${aiPrompt}` : "Gere o texto primeiro para obter um prompt"}
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
            </div>
        )}
      </div>

      {/* COLUNA DIREITA: EDITOR VISUAL (Integrated Media Manager) */}
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
                    title="Buscar referências reais no Google Imagens"
                 >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    Buscar Referência
                 </button>
             </div>
             
             {/* Controles de Imagem (Upload/AI/Remix) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Imagem via IA</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Descreva a imagem..."
                            className="flex-1 text-xs p-2 border border-slate-700 bg-slate-900 text-white rounded outline-none placeholder-slate-400"
                        />
                        <button 
                            onClick={handleAiGenerateImage}
                            disabled={imageLoading || !aiPrompt}
                            className="bg-pink-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-pink-700 disabled:opacity-50"
                        >
                            {imageLoading ? '...' : 'Criar'}
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ou Upload</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 cursor-pointer"
                        />
                    </div>
                </div>
             </div>

             {/* Botão de Remix e Sugestões IA */}
             <div className="flex flex-col gap-2">
                 {imageSrc && (
                    <div className="bg-purple-50 p-2 rounded border border-purple-100 flex items-center justify-between">
                        <div className="text-xs text-purple-800">
                            <strong>Anti-Copyright:</strong> Recrie esta imagem com IA.
                        </div>
                        <button 
                            onClick={handleRemixImage}
                            disabled={remixLoading}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
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
                                className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors"
                             >
                                {text}
                             </button>
                        ))}
                        {overlaySuggestions.length === 0 && !overlayLoading && (
                            <span className="text-xs text-slate-400 italic">Gere um texto primeiro para ver sugestões.</span>
                        )}
                    </div>
                 </div>
             </div>

             {/* Controles de Texto SELECIONADO (Expandido) */}
             {selectedText && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 animate-fade-in space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600 uppercase">Editando Texto</span>
                        <button onClick={() => setTexts(texts.filter(t => t.id !== selectedTextId))} className="text-red-500 hover:bg-red-100 p-1 rounded">🗑️ Remover</button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <input 
                            value={selectedText.text}
                            onChange={(e) => updateSelectedText('text', e.target.value)}
                            className="w-full border border-slate-700 bg-slate-900 text-white rounded text-sm p-2"
                            placeholder="Texto..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Tamanho: {selectedText.fontSize}px</label>
                             <input 
                                type="range" 
                                min="10" max="150"
                                value={selectedText.fontSize} 
                                onChange={(e) => updateSelectedText('fontSize', Number(e.target.value))}
                                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Rotação: {selectedText.rotation}°</label>
                             <input 
                                type="range" 
                                min="0" max="360"
                                value={selectedText.rotation} 
                                onChange={(e) => updateSelectedText('rotation', Number(e.target.value))}
                                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                         <div className="flex items-center gap-1 border border-slate-300 rounded p-1 bg-white">
                            <span className="text-xs text-slate-400">Cor Texto:</span>
                            <input 
                                type="color" 
                                value={selectedText.color}
                                onChange={(e) => updateSelectedText('color', e.target.value)}
                                className="w-6 h-6 border-0 p-0 cursor-pointer"
                            />
                         </div>
                         <div className="flex items-center gap-1 border border-slate-300 rounded p-1 bg-white">
                            <span className="text-xs text-slate-400">Cor Fundo:</span>
                            <input 
                                type="color" 
                                value={selectedText.backgroundColor === 'transparent' ? '#000000' : selectedText.backgroundColor}
                                onChange={(e) => updateSelectedText('backgroundColor', e.target.value)}
                                className="w-6 h-6 border-0 p-0 cursor-pointer"
                            />
                             <button 
                                onClick={() => updateSelectedText('backgroundColor', selectedText.backgroundColor === 'transparent' ? '#000000' : 'transparent')}
                                className="text-xs px-1 text-slate-500 hover:text-red-500"
                                title="Remover Fundo"
                            >
                                🚫
                            </button>
                         </div>
                         <button 
                            onClick={() => updateSelectedText('isBold', !selectedText.isBold)} 
                            className={`text-xs px-3 py-1 rounded border font-bold ${selectedText.isBold ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'}`}
                        >
                            B
                        </button>
                         <select 
                            value={selectedText.fontFamily}
                            onChange={(e) => updateSelectedText('fontFamily', e.target.value)}
                            className="border border-slate-700 bg-slate-900 text-white rounded text-xs p-1"
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
                    <p className="mb-2">Gere, busque ou faça upload de uma imagem.</p>
                </div>
            ) : (
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="max-w-full max-h-full object-contain cursor-crosshair shadow-lg"
                />
            )}
            
            {/* Botões Flutuantes sobre o Canvas */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                 <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => addText('TÍTULO', 60, true)}
                        disabled={!imageSrc}
                        className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg font-extrabold text-sm hover:bg-slate-50 disabled:opacity-50 border border-slate-200"
                    >
                        + TÍTULO
                    </button>
                    <button 
                        onClick={() => addText('Legenda', 30, false)}
                        disabled={!imageSrc}
                        className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-lg font-medium text-sm hover:bg-slate-50 disabled:opacity-50 border border-slate-200"
                    >
                        + Legenda
                    </button>
                 </div>
                <button 
                    onClick={handleDownload}
                    disabled={!imageSrc}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    Baixar Imagem
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};