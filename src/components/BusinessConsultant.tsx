import React, { useState } from 'react';
import { askBusinessConsultant } from '../services/geminiService';

export const BusinessConsultant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');

    try {
      const responseText = await askBusinessConsultant(question);
      setAnswer(responseText);
    } catch (error) {
      setAnswer("**Erro:** Não foi possível obter a resposta do consultor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="text-orange-500">💡</span> Consultor de Negócios IA
        </h2>
        <p className="text-slate-600 mb-6">
          Tire dúvidas sobre gestão, tráfego pago, marketing local ou estratégias de vendas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Qual é o seu desafio hoje?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Como posso atrair mais clientes para minha padaria em dias de chuva? Ou: Qual a melhor forma de fazer anúncios no Instagram para serviços locais?"
              rows={3}
              className="w-full p-3 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`w-full font-bold py-3 rounded-lg transition-all text-white
              ${loading || !question.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20'
              }`}
          >
            {loading ? 'Consultando Especialista...' : 'Pedir Ajuda ao Consultor'}
          </button>
        </form>
      </div>

      {answer && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-lg">
              👨‍💼
            </div>
            <h3 className="font-bold text-slate-800">Resposta do Especialista (Editável)</h3>
          </div>
          <div className="p-6 md:p-8">
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-96 p-4 border border-slate-700 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm leading-relaxed placeholder-slate-400"
                placeholder="A resposta do consultor aparecerá aqui..."
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(answer)}
                className="text-sm font-bold bg-white border border-orange-200 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Copiar Resposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};