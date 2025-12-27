import React from 'react';

interface TrialAlertProps {
  daysRemaining: number;
  onUpgrade: () => void;
}

export const TrialAlert: React.FC<TrialAlertProps> = ({ daysRemaining, onUpgrade }) => {
  const isLastDay = daysRemaining === 1;
  const isUrgent = daysRemaining <= 2;

  return (
    <div className={`neumorph-flat rounded-3xl p-6 mb-6 animate-in fade-in slide-in-from-top duration-500`}>
      <div className="flex items-start gap-4">
        <div className={`${isUrgent ? 'bg-[#EA4335]' : 'bg-[#FBBC05]'} rounded-2xl p-3 shrink-0`}>
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className={`font-black text-lg ${isUrgent ? 'text-[#EA4335]' : 'text-[#FBBC05]'}`}>
            {isLastDay ? '⏰ Último dia de teste grátis!' : `⏰ ${daysRemaining} dias restantes no seu teste`}
          </h3>
          <p className="text-sm mt-1 text-gray-600">
            {isLastDay 
              ? 'Seu período de teste termina hoje! Não perca o acesso às funcionalidades.'
              : 'Aproveite a oferta exclusiva de fundador antes que acabe!'
            }
          </p>
          
          <button
            onClick={onUpgrade}
            className={`mt-4 px-6 py-3 rounded-xl font-bold text-white transition-all neumorph-button ${
              isUrgent 
                ? 'bg-[#EA4335] hover:bg-[#D93025]' 
                : 'bg-[#FBBC05] hover:bg-[#F9AB00]'
            }`}
          >
            🚀 Ver Planos - Oferta Fundador (Apenas 100 vagas)
          </button>
        </div>
        
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors neumorph-button p-2 rounded-full"
          onClick={(e) => {
            e.currentTarget.parentElement?.parentElement?.remove();
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface ExpiredTrialBannerProps {
  onUpgrade: () => void;
}

export const ExpiredTrialBanner: React.FC<ExpiredTrialBannerProps> = ({ onUpgrade }) => {
  return (
    <>
      {/* Banner Superior Fixo */}
      <div className="fixed top-0 left-0 w-full bg-[#EA4335] text-white p-3 flex items-center justify-center gap-4 shadow-lg z-[9998]">
        <svg className="hidden sm:block" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-center">
          Seu acesso expirou. Recupere seus recursos e garanta a licença vitalícia agora.
        </span>
        <button 
          onClick={onUpgrade}
          className="bg-white text-[#EA4335] px-4 py-1.5 rounded-full text-[10px] font-black uppercase hover:scale-105 transition-transform whitespace-nowrap"
        >
          REATIVAR CONTA
        </button>
      </div>

      {/* Modal de Bloqueio Central */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9997] flex items-center justify-center p-4" style={{ marginTop: '48px' }}>
        <div className="bg-[#f0f2f5] neumorph-flat rounded-[2rem] sm:rounded-[3rem] max-w-lg w-full p-8 text-center">
          
          <div className="bg-[#EA4335] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="inline-block bg-[#EA4335] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
            Oferta Limitada
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-3 leading-tight">
            Dashboard <span className="text-[#4285F4]">Bloqueado</span>
          </h2>
          
          <p className="text-gray-600 mb-8 text-sm leading-relaxed px-4">
            Seu plano atual não permite o acesso. Torne-se um <strong className="text-[#4285F4]">Founder</strong> e tenha acesso <span className="text-gray-800 font-bold">Vitalício</span> sem mensalidades.
          </p>
          
          <div className="inline-block p-1 rounded-[2rem] bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] mb-6">
            <button
              onClick={onUpgrade}
              className="bg-[#f0f2f5] px-8 sm:px-12 py-4 sm:py-5 rounded-[1.8rem] text-base sm:text-xl font-black text-gray-800 hover:text-[#4285F4] transition-all"
            >
              DESBLOQUEAR TUDO AGORA
            </button>
          </div>
          
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Acesso vitalício • Apenas 100 vagas • Sem mensalidades
          </p>
        </div>

        {/* Background Decorativo */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4285F4]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FBBC05]/10 blur-[120px] rounded-full"></div>
        </div>
      </div>
    </>
  );
};