import React, { useState } from 'react';
import { generatePost } from '../services/groqService';
import { PostResult } from '../types';
import { GBPQuickAccessButton } from './GBPQuickAccessButton';
import { ImageEditor } from './ImageEditor';

export const PostGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [platform, setPlatform] = useState('GBP');
  const [loading, setLoading] = useState(false);
  const [postResult, setPostResult] = useState<PostResult | null>(null);
  const [editableContent, setEditableContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await generatePost(topic, tone, platform);
      setPostResult(data);
      setEditableContent(data.content);
    } catch {
      alert('Erro ao gerar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Monta o prompt em inglês para o editor de imagem
  const buildImagePrompt = () => {
    if (!postResult?.imagePrompt) return topic ? `Professional photo for a local business about: ${topic}` : '';
    return postResult.imagePrompt;
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

        {/* CARD: COPYWRITER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Copywriter IA</h2>
                <p className="text-xs text-slate-500">Gere textos otimizados para o Google</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="px-6 py-5 space-y-4">
            {/* Tema */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tema do Post</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Promoção de fim de semana, novo produto, dica..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-slate-400 transition-all"
              />
            </div>

            {/* Tom + Plataforma */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tom</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-400">
                  <option>Profissional</option>
                  <option>Divertido</option>
                  <option>Urgente</option>
                  <option>Empático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Plataforma</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-400">
                  <option>GBP</option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || !topic.trim()}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-purple-200">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Escrevendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Gerar Texto
                </>
              )}
            </button>
          </form>
        </div>

        {/* CARD: RESULTADO */}
        {postResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-slate-700">Texto Gerado</span>
              </div>
              <span className="text-xs text-slate-400">Editável</span>
            </div>

            <div className="px-6 py-5 space-y-4">
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed"
              />

              {/* Hashtags */}
              {postResult.hashtags && postResult.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {postResult.hashtags.map(tag => (
                    <span key={tag} onClick={() => { setEditableContent(prev => prev + ' ' + tag); }}
                      className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${copied ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
                  {copied ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copiado!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Copiar Texto</>
                  )}
                </button>
              </div>

              <GBPQuickAccessButton variant="primary" className="w-full" />
            </div>
          </div>
        )}

        {/* CARD: EDITOR DE IMAGEM */}
        <div className={`rounded-2xl border-2 overflow-hidden transition-all ${postResult ? 'border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50' : 'border-slate-200 bg-white'}`}>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Editor de Imagem</h2>
                <p className="text-xs text-slate-500">
                  {postResult ? 'Prompt gerado automaticamente ✨' : 'Crie visuais para seu post'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEditor(true)}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Abrir Editor de Imagem
            </button>

            {postResult && (
              <p className="text-center text-xs text-slate-400 mt-3">
                O prompt de imagem foi gerado com base no seu texto
              </p>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: EDITOR DE IMAGEM */}
      <ImageEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        initialPrompt={buildImagePrompt()}
      />
    </>
  );
};