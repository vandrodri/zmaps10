import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  currentView?: AppView;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentView }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShowCookieConsent(true);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  return (
    <>
      {/* FOOTER - minimalista, desktop e mobile */}
      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="https://i.postimg.cc/NG1M7wXY/maps-guru-logo.png"
                alt="MapsGuru"
                className="h-5 w-auto object-contain"
              />
              <span>·</span>
              <span>© 2024 Zapy Marketing Local</span>
            </div>

            {/* Links legais */}
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('terms')} className="hover:text-slate-600 transition-colors">Termos</button>
              <button onClick={() => onNavigate('privacy')} className="hover:text-slate-600 transition-colors">Privacidade</button>
              <button onClick={() => onNavigate('cookies')} className="hover:text-slate-600 transition-colors">Cookies</button>
              <a href="mailto:zapy@zapy.click" className="hover:text-slate-600 transition-colors">Contato</a>
            </div>

            <span className="text-slate-300 hidden sm:block">v1.0</span>
          </div>
        </div>
      </footer>

      {/* AVISO DE COOKIES */}
      {showCookieConsent && (
        <div className="fixed bottom-0 md:bottom-4 left-0 right-0 md:left-4 md:right-4 z-50 p-3 md:p-0">
          <div className="max-w-2xl mx-auto bg-slate-900/97 backdrop-blur shadow-2xl md:rounded-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Respeitamos sua privacidade</p>
                <p className="text-slate-400 text-xs">
                  Usamos cookies para melhorar sua experiência.{' '}
                  <button onClick={() => onNavigate('privacy')} className="text-indigo-400 underline hover:text-indigo-300">
                    Saiba mais
                  </button>
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowCookieConsent(false)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
              >
                Recusar
              </button>
              <button
                onClick={handleAcceptCookies}
                className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};