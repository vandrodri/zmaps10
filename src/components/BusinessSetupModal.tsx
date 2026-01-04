import React, { useState } from 'react';

interface BusinessSetupModalProps {
  isOpen: boolean;
  onComplete: (data: BusinessSetupData) => void;
  onSkip: () => void;
  userName: string;
}

export interface BusinessSetupData {
  businessName: string;
  gbpLink: string;
}

export const BusinessSetupModal: React.FC<BusinessSetupModalProps> = ({ 
  isOpen, 
  onComplete, 
  onSkip,
  userName 
}) => {
  const [businessName, setBusinessName] = useState('');
  const [gbpLink, setGbpLink] = useState('');
  const [errors, setErrors] = useState<{ businessName?: string; gbpLink?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { businessName?: string; gbpLink?: string } = {};
    
    // Validação do link (apenas se preenchido)
    if (gbpLink && !gbpLink.startsWith('http')) {
      newErrors.gbpLink = 'O link deve começar com http:// ou https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onComplete({
      businessName: businessName.trim(),
      gbpLink: gbpLink.trim()
    });
  };

  const handleSkip = () => {
    onSkip();
  };

  const canSubmit = businessName.trim() || gbpLink.trim();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-scale-in">
        
        {/* Logo Z */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform -rotate-3 hover:rotate-0 transition-all duration-300 border border-white/20">
              <span className="text-white font-black text-4xl font-serif italic drop-shadow-md select-none">Z</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
            Vamos configurar seu negócio!
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            {userName.split(' ')[0]}, preencha os dados abaixo para personalizar sua experiência
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-5 mb-6">
          
          {/* Nome do Negócio */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nome do seu negócio
            </label>
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl p-1">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Padaria Pão Quente"
                className="w-full px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
              />
            </div>
            {errors.businessName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.businessName}</p>
            )}
          </div>

          {/* Link do Google Meu Negócio */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Link do Google Meu Negócio
            </label>
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl p-1">
              <input
                type="url"
                value={gbpLink}
                onChange={(e) => setGbpLink(e.target.value)}
                placeholder="https://business.google.com/..."
                className="w-full px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
              />
            </div>
            {errors.gbpLink && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.gbpLink}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Cole o link do painel do Google Meu Negócio para acesso rápido
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900 mb-1">Por que preencher?</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• A IA vai personalizar os conteúdos com o nome do seu negócio</li>
                  <li>• Acesse rapidamente seu painel do Google com um clique</li>
                  <li>• Você pode pular e preencher depois no perfil</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] text-gray-700 font-bold rounded-xl transition-all"
          >
            Pular por enquanto
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              canSubmit
                ? 'bg-[#34A853]/90 hover:bg-[#34A853] text-white shadow-green-500/30'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Salvar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};