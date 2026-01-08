import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  userName: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartTour,
  userName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-scale-in">
        
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
  {/* Logo MapsGuru */}
  <div className="inline-flex items-center justify-center mb-4">
    <div className="w-16 h-16 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-300 border border-white/20">
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MapsGuru"
      >
        {/* Pin */}
        <path
          d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 14.47 12 22 12 22C12 22 19.5 14.47 19.5 9.5C19.5 5.36 16.14 2 12 2Z"
          fill="white"
        />
        {/* Estrela */}
        <path
          d="M12 7.2L13.09 9.41L15.53 9.76L13.76 11.48L14.18 13.9L12 12.75L9.82 13.9L10.24 11.48L8.47 9.76L10.91 9.41L12 7.2Z"
          fill="#FBBC05"
        />
      </svg>
    </div>
  </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
            Bem-vindo, {userName.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            MapsGuru - Sua plataforma completa de IA para Google Meu Negócio
          </p>
        </div>

        {/* Features Grid - Estilo Neumorpho Inset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] transition-all hover:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Criar Posts</h3>
            </div>
            <p className="text-sm text-gray-600">Textos + imagens profissionais em segundos</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] transition-all hover:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-600 rounded-lg shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Responder Reviews</h3>
            </div>
            <p className="text-sm text-gray-600">Respostas inteligentes para suas avaliações</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] transition-all hover:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-600 rounded-lg shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">FAQ Automático</h3>
            </div>
            <p className="text-sm text-gray-600">Perguntas frequentes geradas por IA</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-4 rounded-xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] transition-all hover:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.12),inset_-3px_-3px_7px_rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-600 rounded-lg shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800">Consultor IA</h3>
            </div>
            <p className="text-sm text-gray-600">Estratégias personalizadas para seu negócio</p>
          </div>
        </div>

        {/* Trial Info - Neumorpho */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-bold text-lg text-gray-800">7 dias de trial grátis</p>
              </div>
              <p className="text-sm text-gray-600">3 gerações por dia • Sem cartão de crédito</p>
            </div>
            <svg className="w-12 h-12 text-blue-600 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] text-gray-700 font-bold rounded-xl transition-all"
          >
            Explorar Sozinho
          </button>
          <button
            onClick={() => {
              onClose();
              onStartTour();
            }}
            className="flex-1 px-6 py-3 bg-[#34A853]/90 hover:bg-[#34A853] text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fazer Tour Guiado
          </button>
        </div>
      </div>
    </div>
  );
};