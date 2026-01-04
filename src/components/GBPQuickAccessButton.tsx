import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface GBPQuickAccessButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const GBPQuickAccessButton: React.FC<GBPQuickAccessButtonProps> = ({ 
  className = '',
  variant = 'primary'
}) => {
  const [gbpLink, setGbpLink] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGBPLink();
  }, []);

  const loadGBPLink = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setGbpLink(data.gbpLink || '');
      }
    } catch (error) {
      console.error('Erro ao carregar link do GBP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGBP = () => {
    if (gbpLink) {
      window.open(gbpLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Não mostrar se ainda está carregando
  if (loading) return null;

  // Não mostrar se não tem link cadastrado
  if (!gbpLink) return null;

  // Variante Primary (destaque)
  if (variant === 'primary') {
    return (
      <button
        onClick={handleOpenGBP}
        className={`w-full px-6 py-4 bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:from-[#357ae8] hover:to-[#2d8e47] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group ${className}`}
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>Abrir no Google Meu Negócio</span>
        <svg className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    );
  }

  // Variante Secondary (mais discreto)
  return (
    <button
      onClick={handleOpenGBP}
      className={`px-4 py-2 bg-white border-2 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4] hover:text-white font-bold rounded-lg transition-all flex items-center gap-2 group ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Abrir GMN</span>
      <svg className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </button>
  );
};