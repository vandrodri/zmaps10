import React from 'react';

interface FounderBadgeProps {
  founderNumber?: number;
  variant?: 'sidebar' | 'profile' | 'compact';
}

export const FounderBadge: React.FC<FounderBadgeProps> = ({ 
  founderNumber, 
  variant = 'sidebar' 
}) => {
  
  // Badge para SIDEBAR (pequeno e compacto)
  if (variant === 'sidebar') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-[#FBBC05] to-[#EA4335] rounded-lg shadow-lg">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[9px] font-black text-white uppercase tracking-wider">
          Fundador {founderNumber ? `#${founderNumber}` : ''}
        </span>
      </div>
    );
  }
  
  // Badge COMPACTO (para header/perfil)
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#FBBC05] to-[#EA4335] rounded-full">
        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[8px] font-black text-white uppercase">
          #{founderNumber || '?'}
        </span>
      </div>
    );
  }
  
  // Badge GRANDE (para página de perfil completa)
  return (
    <div className="bg-[#f0f2f5] rounded-2xl p-6 shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FBBC05] to-[#EA4335] rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FBBC05] to-[#EA4335]">
            Fundador
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            Membro #{founderNumber || '?'} de 100
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Acesso vitalício garantido
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-black text-[#4285F4]">∞</div>
            <div className="text-[8px] text-gray-500 uppercase font-bold">Acesso</div>
          </div>
          <div>
            <div className="text-lg font-black text-[#34A853]">✓</div>
            <div className="text-[8px] text-gray-500 uppercase font-bold">VIP</div>
          </div>
          <div>
            <div className="text-lg font-black text-[#EA4335]">#{founderNumber || '?'}</div>
            <div className="text-[8px] text-gray-500 uppercase font-bold">Fundador</div>
          </div>
        </div>
      </div>
    </div>
  );
};