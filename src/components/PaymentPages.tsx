import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// PAYMENT SUCCESS PAGE
// ============================================
export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Recupera dados do pagamento
    const paymentData = localStorage.getItem('zmaps_payment_data');
    console.log('✅ Pagamento aprovado! Dados:', paymentData);

    // Countdown para redirecionar
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('zmaps_payment_data');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f0f2f5] p-12 rounded-[2.5rem] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] text-center">
        
        {/* Ícone de Sucesso */}
        <div className="w-20 h-20 mx-auto mb-6 bg-[#f0f2f5] rounded-full shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#34A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-3">
          Pagamento Aprovado! 🎉
        </h1>
        
        <p className="text-gray-600 mb-2">
          Parabéns! Você agora é um <span className="font-bold text-[#4285F4]">Fundador ZMaps</span>!
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Seu acesso vitalício foi ativado com sucesso.
        </p>

        {/* Benefícios */}
        <div className="bg-[#f0f2f5] rounded-2xl p-4 mb-6 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#34A853] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Acesso vitalício ativado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#4285F4] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Badge de Fundador desbloqueado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#FBBC05] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Todas as funcionalidades liberadas</span>
            </div>
          </div>
        </div>

        {/* Contador */}
        <p className="text-xs text-gray-400 mb-6">
          Redirecionando em <span className="font-bold text-[#4285F4]">{countdown}s</span>...
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#4285F4] text-white py-3 px-6 rounded-2xl font-bold transition-all shadow-[5px_5px_10px_rgba(163,177,198,0.4),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
        >
          Acessar Agora
        </button>
      </div>
    </div>
  );
};

// ============================================
// PAYMENT PENDING PAGE
// ============================================
export const PaymentPending: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f0f2f5] p-12 rounded-[2.5rem] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] text-center">
        
        {/* Ícone de Pendente */}
        <div className="w-20 h-20 mx-auto mb-6 bg-[#f0f2f5] rounded-full shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#FBBC05] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-3">
          Pagamento Pendente ⏳
        </h1>
        
        <p className="text-gray-600 mb-8">
          Estamos aguardando a confirmação do pagamento. Você receberá um email assim que for aprovado.
        </p>

        <div className="bg-[#f0f2f5] rounded-2xl p-4 mb-6 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>PIX:</strong> Confirmação em até 2 horas<br/>
            <strong>Boleto:</strong> Até 3 dias úteis<br/>
            <strong>Cartão:</strong> Análise do banco
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-700 text-white py-3 px-6 rounded-2xl font-bold transition-all shadow-[5px_5px_10px_rgba(163,177,198,0.4),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
        >
          Voltar ao App
        </button>
      </div>
    </div>
  );
};

// ============================================
// PAYMENT FAILURE PAGE
// ============================================
export const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f0f2f5] p-12 rounded-[2.5rem] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] text-center">
        
        {/* Ícone de Erro */}
        <div className="w-20 h-20 mx-auto mb-6 bg-[#f0f2f5] rounded-full shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#EA4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-3">
          Pagamento Recusado ❌
        </h1>
        
        <p className="text-gray-600 mb-8">
          Não conseguimos processar seu pagamento. Por favor, verifique seus dados e tente novamente.
        </p>

        <div className="bg-[#f0f2f5] rounded-2xl p-4 mb-6 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          <p className="text-sm text-gray-600 text-left leading-relaxed">
            <strong>Possíveis causas:</strong><br/>
            • Saldo insuficiente<br/>
            • Dados do cartão incorretos<br/>
            • Limite de compra excedido<br/>
            • Problema com o banco emissor
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#4285F4] text-white py-3 px-6 rounded-2xl font-bold transition-all shadow-[5px_5px_10px_rgba(163,177,198,0.4),-5px_-5px_10px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
          >
            Tentar Novamente
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-bold transition-all shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
          >
            Voltar ao App
          </button>
        </div>
      </div>
    </div>
  );
};