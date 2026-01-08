import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou cookies (simulação simples com localStorage)
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieConsent(false);
  };

  return (
    <>
      {/* RODAPÉ PRINCIPAL */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Coluna 1: Marca e Slogan */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {/* Logo MapsGuru Compacto */}
                <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="MapsGuru"
                  >
                    {/* Pin */}
                    <path
                      d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 14.47 12 22 12 22C12 22 19.5 14.47 19.5 9.5C19.5 5.36 16.14 2 12 2Z"
                      fill="white"
                    />
                    {/* Estrela */}
                    <path
                      d="M12 7.2L13.09 9.41L15.53 9.76L13.76 11.48L14.18 13.9L12 12.75L9.82 13.9L10.24 11.48L8.47 9.76L10.91 9.41L12 7.2Z"
                      fill="#FBBC05"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-800">MapsGuru</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Potencialize seu negócio local com inteligência artificial e estratégias baseadas em dados reais do Google Maps.
              </p>
            </div>

            {/* Coluna 2: Contato */}
            <div className="col-span-1">
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Contato</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">🌐</span>
                  <a href="https://zapy.click" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                    zapy.click
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">📧</span>
                  <a href="mailto:zapy@zapy.click" className="hover:text-indigo-600 transition-colors">
                    zapy@zapy.click
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Links Legais */}
            <div className="col-span-1">
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <button onClick={() => onNavigate('terms')} className="hover:text-indigo-600 transition-colors text-left">
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('privacy')} className="hover:text-indigo-600 transition-colors text-left">
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('cookies')} className="hover:text-indigo-600 transition-colors text-left">
                    Cookies
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Social */}
            <div className="col-span-1">
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Siga-nos</h4>
              <div className="flex gap-4">
                {/* Instagram */}
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>&copy; 2024 Zapy Marketing Local. Todos os direitos reservados.</p>
            <p className="flex gap-4">
              <span>MapsGuru AI Suite v1.0</span>
            </p>
          </div>
        </div>
      </footer>

      {/* AVISO DE COOKIES */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur shadow-2xl rounded-2xl p-4 md:p-6 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-2 rounded-lg hidden md:block">
                <span className="text-2xl">🍪</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">Respeitamos sua privacidade</p>
                <p className="text-slate-300 text-xs md:text-sm">
                  Utilizamos cookies para melhorar sua experiência no MapsGuru e analisar nosso tráfego. 
                  Ao continuar, você concorda com nossa <button onClick={() => onNavigate('privacy')} className="text-indigo-400 underline hover:text-indigo-300">Política de Privacidade</button>.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowCookieConsent(false)}
                className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
              >
                Configurar
              </button>
              <button 
                onClick={handleAcceptCookies}
                className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105"
              >
                Aceitar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};