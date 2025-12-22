<<<<<<< HEAD
import React from 'react';

// ============================================================
// CÓDIGO ORIGINAL COMENTADO - Para reativar, descomente tudo
// ============================================================
/*
import { useState } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380
import { analyzeBusiness } from './services/groqService';
import { AnalysisView } from './components/AnalysisView';
import { AnalysisResult } from './types';

const Dashboard: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName.trim() || !location.trim()) {
        setError("Por favor, preencha o nome da empresa e a localização.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisData = await analyzeBusiness(businessName, location);
      setResult(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      
<<<<<<< HEAD
=======
      {/* Welcome / Header Section inside Dashboard */}
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380
      {!result && (
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Gerencie seu GBP com <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Inteligência Artificial</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analise seu perfil, espione a concorrência e gere postagens otimizadas para SEO local em segundos.
          </p>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Input Section */}
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380
      <div className={`transition-all duration-500 ${result ? '' : 'max-w-3xl mx-auto'}`}>
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-2 text-xs font-mono text-slate-400">auditoria_gbp.exe</span>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="businessName" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Nome do Negócio
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Pizzaria do Zé"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Localização (Cidade/Bairro)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Pinheiros, SP"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                 <div className="flex-1 text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">Dica:</span> Use o nome exato que aparece no Maps para garantir que a IA encontre o perfil correto.
                 </div>
                 <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5
                    ${loading 
                      ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Auditoria em Progresso...</span>
                    </div>
                  ) : (
                    'Gerar Estratégia'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Error Display */}
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380
      {error && (
        <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center animate-fade-in-up">
           <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Results View */}
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380
      {result && (
        <div className="animate-fade-in-up">
           <AnalysisView result={result} />
        </div>
      )}
    </div>
  );
};
<<<<<<< HEAD
*/
// ============================================================
// FIM DO CÓDIGO ORIGINAL
// ============================================================

// ============================================================
// NOVA VERSÃO - CTA PARA LANDING PAGE
// ============================================================
const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-16 px-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            🎯 Auditoria Gratuita de Perfil
          </h1>
          <p className="text-blue-100 text-lg">
            Descubra em 2 minutos o que está impedindo seu negócio de aparecer no Google Maps
          </p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-8">
          {/* Benefícios */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Diagnóstico Completo</h3>
                <p className="text-slate-600 text-sm">Descubra seus pontos fracos e o que está te custando clientes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Plano de Ação Prático</h3>
                <p className="text-slate-600 text-sm">Receba ações claras e simples para aplicar hoje mesmo</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Sem Custo</h3>
                <p className="text-slate-600 text-sm">100% gratuito, sem precisar cadastrar cartão</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Resultado em 2 Minutos</h3>
                <p className="text-slate-600 text-sm">Análise rápida e direto ao ponto, sem enrolação</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <p className="text-slate-700 text-lg font-medium">
              Pronto para descobrir o que está te impedindo de conquistar mais clientes?
            </p>
            
            <a 
              href="https://zmaps-auditor.netlify.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <span>Fazer Auditoria Gratuita Agora</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p className="text-sm text-slate-500">
              ⚡ Sem cadastro • Sem cartão • Resultado imediato
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
=======
>>>>>>> fd3e5c63931777c9b37713cb155d0aa923341380

export default Dashboard;