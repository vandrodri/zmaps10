import React, { useState, useEffect } from 'react';
import { getFounderInfo } from '../founderService';
import { createCashPayment, createInstallmentPayment, SubscriptionData } from '../mercadoPagoService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  userName: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  userId, 
  userEmail, 
  userName 
}) => {
  const [founderInfo, setFounderInfo] = useState({ hasSpots: true, spotsLeft: 100, current: 0 });
  const [loading, setLoading] = useState<'cash' | 'installments' | null>(null);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      loadFounderInfo();
    }
  }, [isOpen]);

  const loadFounderInfo = async () => {
    const info = await getFounderInfo();
    setFounderInfo(info);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // ============================================
  // PAGAMENTO À VISTA
  // ============================================
  const handleCashPayment = async () => {
    setLoading('cash');
    setError('');

    try {
      const data: SubscriptionData = {
        userId,
        userEmail,
        userName,
        planType: 'annual',
        isFounder: founderInfo.hasSpots
      };

      const result = await createCashPayment(data);

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // PAGAMENTO PARCELADO
  // ============================================
  const handleInstallmentPayment = async () => {
    setLoading('installments');
    setError('');

    try {
      const data: SubscriptionData = {
        userId,
        userEmail,
        userName,
        planType: 'installments',
        isFounder: founderInfo.hasSpots
      };

      const result = await createInstallmentPayment(data);

      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  const benefits = [
    { 
      title: "Pagamento Único", 
      desc: "Diga adeus às mensalidades.", 
      icon: (
        <svg className="text-[#34A853]" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      title: "Recursos Ilimitados", 
      desc: "Acesso total a todas IAs.", 
      icon: (
        <svg className="text-[#FBBC05]" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: "Suporte VIP", 
      desc: "WhatsApp prioritário.", 
      icon: (
        <svg className="text-[#4285F4]" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    { 
      title: "Futuras Updates", 
      desc: "Novas funções inclusas.", 
      icon: (
        <svg className="text-[#EA4335]" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
  ];

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose}></div>

      <div className={`relative w-full max-w-lg bg-[#f0f2f5] neumorph-flat rounded-[2rem] sm:rounded-[3rem] overflow-hidden transition-all duration-300 flex flex-col max-h-[92vh] ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 rounded-full neumorph-button text-gray-400 hover:text-gray-600 z-30"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="shrink-0 bg-[#EA4335] text-white py-1.5 text-[9px] font-black text-center uppercase tracking-[0.15em] flex items-center justify-center gap-2 z-20">
          <svg className="animate-pulse" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Atenção: Restam apenas {founderInfo.spotsLeft} vagas de Fundador
        </div>

        <div className="overflow-y-auto pt-5 sm:pt-8 text-center scrollbar-hide flex flex-col">
          <div className="px-5 sm:px-8 pb-8">
            <header className="mb-4 sm:mb-6">
              <span className="text-[#4285F4] font-bold tracking-[0.2em] text-[9px] uppercase mb-0.5 block">Oportunidade de Fundador</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">Plano <span className="text-[#4285F4]">Founders</span></h2>
              <p className="text-gray-500 text-xs mt-1 px-4">Acesso vitalício sem mensalidades recorrentes.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 neumorph-inset rounded-xl text-left">
                  <div className="shrink-0">{b.icon}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-[10px] leading-none">{b.title}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5 leading-tight">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid de Opções de Pagamento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
              
              {/* Opção 1: À Vista (Destaque) */}
              <div className="neumorph-inset rounded-2xl p-5 bg-gradient-to-br from-white/50 to-[#E8F0FE]/30 border-2 border-[#4285F4] relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#34A853] text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase">
                  💰 Mais Vantagem
                </div>
                
                <div className="text-center mt-2">
                  <p className="text-gray-400 line-through text-[9px] font-bold">De R$ 1.997</p>
                  <div className="flex items-center justify-center gap-0.5 my-2">
                    <span className="text-gray-800 text-xs font-black self-start mt-1">R$</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#4285F4] tracking-tighter">297</span>
                    <span className="text-gray-800 font-black text-sm self-start mt-1">,00</span>
                  </div>
                  <p className="text-[8px] font-bold text-[#34A853] uppercase mb-1">À VISTA</p>
                  <p className="text-[7px] text-gray-500 mb-3">PIX ou cartão de débito</p>
                  
                  <div className="bg-[#E8F0FE] rounded-lg p-2 mb-3">
                    <p className="text-[8px] font-black text-[#4285F4]">🎉 ECONOMIZE R$ 59,40</p>
                  </div>
                  
                  <button 
                    className={`w-full bg-[#4285F4] text-white py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3367D6] active:scale-95'
                    }`}
                    onClick={handleCashPayment}
                    disabled={!!loading || !founderInfo.hasSpots}
                  >
                    {loading === 'cash' ? '⏳ Redirecionando...' : 'PAGAR À VISTA'}
                  </button>
                </div>
              </div>

              {/* Opção 2: Parcelado */}
              <div className="neumorph-inset rounded-2xl p-5 bg-white/30 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FBBC05] text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase">
                  💳 Parcelado
                </div>
                
                <div className="text-center mt-2">
                  <p className="text-gray-400 line-through text-[9px] font-bold">De R$ 1.997</p>
                  <div className="flex items-center justify-center gap-0.5 my-2">
                    <span className="text-gray-800 text-[10px] font-black">12x de</span>
                  </div>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-gray-800 text-xs font-black self-start mt-1">R$</span>
                    <span className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tighter">29</span>
                    <span className="text-gray-800 font-black text-sm self-start mt-1">,70</span>
                  </div>
                  <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">SEM JUROS</p>
                  <p className="text-[7px] text-gray-400 mb-3">Total: R$ 356,40 no cartão</p>
                  
                  <div className="bg-gray-100 rounded-lg p-2 mb-3">
                    <p className="text-[8px] font-black text-gray-600">Facilita o bolso 📊</p>
                  </div>
                  
                  <button 
                    className={`w-full bg-gray-700 text-white py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 active:scale-95'
                    }`}
                    onClick={handleInstallmentPayment}
                    disabled={!!loading || !founderInfo.hasSpots}
                  >
                    {loading === 'installments' ? '⏳ Redirecionando...' : 'PARCELAR 12X'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-200/50">
              <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 text-left">
                <svg width="12" height="12" className="text-[#34A853] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="uppercase">14 DIAS DE GARANTIA: Resultado, ou seu dinheiro de volta</span>
              </div>
              <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" alt="Seguro" className="h-2 opacity-40 grayscale" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};