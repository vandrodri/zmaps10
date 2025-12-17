import React, { useState } from 'react';
import { generateFaqAnswer } from '../services/geminiService';
import { FaqResult } from '../types';

const FaqGenerator: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [tone, setTone] = useState('Profissional e Atencioso');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FaqResult | null>(null);
  const [editableAnswer, setEditableAnswer] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateFaqAnswer(question, tone);
      setResult(data);
      setEditableAnswer(data.answer);
    } catch (error) {
      alert("Erro ao gerar resposta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="text-cyan-600">❓</span> Gerador de FAQ
        </h2>
        <p className="text-slate-600 mb-6">
          Crie respostas rápidas e profissionais para as perguntas mais comuns dos seus clientes (ideal para o Q&A do Google).
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pergunta Frequente (FAQ)
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Vocês abrem aos domingos? Aceitam vale refeição?"
              className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tom de Voz
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option>Profissional e Atencioso</option>
              <option>Amigável e Casual</option>
              <option>Entusiasmado</option>
              <option>Curto e Direto</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`w-full font-bold py-3 rounded-lg transition-all text-white
              ${loading || !question.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20'
              }`}
          >
            {loading ? 'Escrevendo Resposta...' : 'Gerar Resposta'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-cyan-500 overflow-hidden animate-fade-in-up">
          <div className="bg-cyan-50 px-6 py-3 border-b border-cyan-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-800">Resposta Sugerida (Editável)</h3>
             <span className="text-xs font-medium text-cyan-800 bg-cyan-100 px-2 py-1 rounded-full">{tone}</span>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pergunta:</p>
                <p className="text-slate-600 italic">"{question}"</p>
            </div>
            
            {/* Editor Manual */}
            <textarea 
                value={editableAnswer}
                onChange={(e) => setEditableAnswer(e.target.value)}
                rows={5}
                className="w-full p-4 border border-slate-700 bg-slate-900 text-white rounded-lg mb-4 focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400"
            />

            <button
              onClick={() => navigator.clipboard.writeText(editableAnswer)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-white text-cyan-700 font-bold rounded-lg hover:bg-cyan-50 transition-colors border border-cyan-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Copiar Resposta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// CORREÇÃO PRINCIPAL: Adicionar export default
export default FaqGenerator;