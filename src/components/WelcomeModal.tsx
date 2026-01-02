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
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-scale-in">
        
        {/* Confete decorativo */}
        <div className="absolute -top-2 -left-2 text-6xl animate-bounce">🎉</div>
        <div className="absolute -top-2 -right-2 text-6xl animate-bounce delay-100">🚀</div>
        
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-6xl">👋</span>
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            Bem-vindo ao ZMaps, {userName.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-lg">
            Sua plataforma completa de IA para Google Business Profile
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="text-3xl mb-2">✍️</div>
            <h3 className="font-bold text-gray-800 mb-1">Criar Posts</h3>
            <p className="text-sm text-gray-600">Textos + imagens profissionais em segundos</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold text-gray-800 mb-1">Responder Reviews</h3>
            <p className="text-sm text-gray-600">Respostas inteligentes para suas avaliações</p>
          </div>
          
          <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
            <div className="text-3xl mb-2">❓</div>
            <h3 className="font-bold text-gray-800 mb-1">FAQ Automático</h3>
            <p className="text-sm text-gray-600">Perguntas frequentes geradas por IA</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-bold text-gray-800 mb-1">Consultor IA</h3>
            <p className="text-sm text-gray-600">Estratégias personalizadas para seu negócio</p>
          </div>
        </div>

        {/* Trial Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">🎁 7 dias de trial grátis</p>
              <p className="text-sm opacity-90">3 gerações por dia • Sem cartão de crédito</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
          >
            Explorar Sozinho
          </button>
          <button
            onClick={() => {
              onClose();
              onStartTour();
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>🎯</span>
            Fazer Tour Guiado
          </button>
        </div>
      </div>
    </div>
  );
};