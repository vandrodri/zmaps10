import React from 'react';
import { UserPlan } from '../types';

interface TrialStatusBannerProps {
  userPlan: UserPlan;
  onUpgrade: () => void;
}

export const TrialStatusBanner: React.FC<TrialStatusBannerProps> = ({ userPlan, onUpgrade }) => {
  // Fundadores não veem banner
  if (userPlan.isFounder) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="font-bold text-sm">Plano Fundador Ativo</p>
              <p className="text-xs opacity-90">Acesso vitalício garantido!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calcula dias restantes
  const daysLeft = userPlan.trialEndsAt 
    ? Math.ceil((new Date(userPlan.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  // Trial expirado
  if (daysLeft <= 0) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold">Trial Expirado</p>
              <p className="text-sm opacity-90">Faça upgrade para continuar usando</p>
            </div>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-all shadow-md"
          >
            Assinar Agora
          </button>
        </div>
      </div>
    );
  }

  // Trial ativo
  const isUrgent = daysLeft <= 3;
  const bgColor = isUrgent 
    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
    : 'bg-gradient-to-r from-blue-500 to-indigo-500';

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{isUrgent ? '⏰' : '🎁'}</span>
          <div>
            <p className="font-bold">
              {daysLeft === 1 ? 'Último dia de trial!' : `${daysLeft} dias de trial restantes`}
            </p>
            <p className="text-sm opacity-90">
              {userPlan.usageCount || 0} de {userPlan.usageLimit || 3} gerações usadas hoje
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-md"
        >
          Fazer Upgrade
        </button>
      </div>
    </div>
  );
};