import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  currentView?: AppView;
}

const NAV_ITEMS = [
  {
    view: 'posts' as AppView,
    label: 'Criar Post',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-50',
    activeBar: 'bg-purple-600',
  },
  {
    view: 'reviews' as AppView,
    label: 'Reviews',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    activeColor: 'text-green-600',
    activeBg: 'bg-green-50',
    activeBar: 'bg-green-600',
  },
  {
    view: 'faq' as AppView,
    label: 'FAQ',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    activeColor: 'text-cyan-600',
    activeBg: 'bg-cyan-50',
    activeBar: 'bg-cyan-600',
  },
  {
    view: 'consultation' as AppView,
    label: 'Consultor',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    activeColor: 'text-orange-500',
    activeBg: 'bg-orange-50',
    activeBar: 'bg-orange-500',
  },
  {
    view: 'profile' as AppView,
    label: 'Perfil',
    icon: (active: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    activeColor: 'text-indigo-600',
    activeBg: 'bg-indigo-50',
    activeBar: 'bg-indigo-600',
  },
];

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
      {/* BOTTOM NAV BAR - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch h-16">
          {NAV_ITEMS.map((item) => {
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all relative
                  ${active ? item.activeColor : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                {active && (
                  <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full ${item.activeBar}`} />
                )}
                <div className={`p-1 rounded-xl transition-all ${active ? item.activeBg : ''}`}>
                  {item.icon(active)}
                </div>
                <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-safe-area-inset-bottom bg-white" />
      </nav>

      {/* Espaçador mobile */}
      <div className="md:hidden h-16" />

      {/* FOOTER DESKTOP - minimalista com logo real */}
      <footer className="hidden md:block bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 text-xs text-slate-400">

            {/* Logo real */}
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/NG1M7wXY/maps-guru-logo.png"
                alt="MapsGuru"
                className="h-6 w-auto object-contain"
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

            <span className="text-slate-300">v1.0</span>
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