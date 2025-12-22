import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const { markdown, groundingMetadata } = result;

  // Extract map sources if available
  const mapSources = groundingMetadata?.groundingChunks?.filter(
    (chunk: any) => chunk.maps?.uri
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* Main Report Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Análise Estratégica do GBP
          </h2>
        </div>
        
        <div className="p-8">
          <div className="markdown-body">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Sources & Citations (Grounding) */}
      {mapSources && mapSources.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Fontes Verificadas (Google Maps)
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {mapSources.map((source: any, index: number) => {
                const mapsData = source.maps;
                if (!mapsData || !mapsData.uri) return null;
                return (
                    <a
                        key={index}
                        href={mapsData.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {mapsData.title || "Ver no Google Maps"}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {mapsData.uri}
                            </p>
                        </div>
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};