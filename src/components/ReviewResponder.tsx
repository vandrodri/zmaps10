import React, { useState } from 'react';
import { generateReviewResponse } from '../services/geminiService';
import { ReviewResponseResult } from '../types';

export const ReviewResponder: React.FC = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponseResult | null>(null);
  const [editableResponse, setEditableResponse] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review) return;
    setLoading(true);
    try {
      const data = await generateReviewResponse(review, rating);
      setResult(data);
      setEditableResponse(data.responseText);
    } catch (error) {
      alert("Erro ao gerar resposta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-green-600">💬</span> Resposta de Avaliações
        </h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">O que o cliente escreveu?</label>
            <textarea 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Cole a avaliação do cliente aqui..."
              rows={4}
              className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none placeholder-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nota dada pelo cliente</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-colors ${rating >= star ? 'text-yellow-400 bg-yellow-50' : 'text-slate-300 bg-slate-50'}`}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Analisando sentimento...' : 'Gerar Resposta Profissional'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden animate-fade-in-up">
           <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-800 text-lg">Sugestão de Resposta (Editável)</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Estratégia: {result.strategy}</span>
                </div>
                
                {/* Editor Manual */}
                <textarea
                    value={editableResponse}
                    onChange={(e) => setEditableResponse(e.target.value)}
                    rows={6}
                    className="w-full p-4 border border-slate-700 bg-slate-900 text-white rounded-lg italic mb-4 focus:ring-2 focus:ring-green-500 outline-none placeholder-slate-400"
                    placeholder="Edite a resposta aqui..."
                />
                
                <button 
                    onClick={() => navigator.clipboard.writeText(editableResponse)}
                    className="w-full py-2 bg-green-50 text-green-700 font-bold rounded-lg hover:bg-green-100 transition-colors border border-green-200 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    Copiar Resposta
                </button>
           </div>
        </div>
      )}
    </div>
  );
};