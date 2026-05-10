import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

interface Banner {
  id: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  color: string;       // ex: 'blue' | 'green' | 'purple' | 'orange' | 'indigo'
  active: boolean;
  order: number;
}

const COLOR_MAP: Record<string, { bg: string; accent: string; badge: string; cta: string }> = {
  blue:   { bg: 'from-blue-600 to-blue-800',     accent: 'bg-blue-500/30',   badge: 'bg-blue-400/30 text-blue-100',   cta: 'bg-white text-blue-700 hover:bg-blue-50' },
  green:  { bg: 'from-emerald-500 to-emerald-700', accent: 'bg-emerald-400/30', badge: 'bg-emerald-400/30 text-emerald-100', cta: 'bg-white text-emerald-700 hover:bg-emerald-50' },
  purple: { bg: 'from-purple-600 to-purple-800', accent: 'bg-purple-500/30', badge: 'bg-purple-400/30 text-purple-100', cta: 'bg-white text-purple-700 hover:bg-purple-50' },
  orange: { bg: 'from-orange-500 to-orange-700', accent: 'bg-orange-400/30', badge: 'bg-orange-400/30 text-orange-100', cta: 'bg-white text-orange-700 hover:bg-orange-50' },
  indigo: { bg: 'from-indigo-600 to-indigo-800', accent: 'bg-indigo-500/30', badge: 'bg-indigo-400/30 text-indigo-100', cta: 'bg-white text-indigo-700 hover:bg-indigo-50' },
  cyan:   { bg: 'from-cyan-500 to-cyan-700',     accent: 'bg-cyan-400/30',   badge: 'bg-cyan-400/30 text-cyan-100',   cta: 'bg-white text-cyan-700 hover:bg-cyan-50' },
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default-1',
    title: '📍 Dica GBP: Poste com frequência',
    description: 'Negócios que publicam pelo menos 1 post por semana no Google têm até 5x mais visualizações. Use o Estúdio de Criação para agilizar!',
    ctaText: 'Criar Post Agora',
    ctaLink: 'posts',
    color: 'blue',
    active: true,
    order: 1,
  },
  {
    id: 'default-2',
    title: '⭐ Dica GBP: Responda todos os reviews',
    description: 'Responder avaliações (positivas e negativas) aumenta a confiança do cliente e melhora seu ranking no Google Maps.',
    ctaText: 'Responder Reviews',
    ctaLink: 'reviews',
    color: 'green',
    active: true,
    order: 2,
  },
  {
    id: 'default-3',
    title: '🔍 Otimização: Complete 100% do perfil',
    description: 'Perfis completos aparecem 7x mais em buscas locais. Adicione horários, fotos, serviços e descrição detalhada do seu negócio.',
    ctaText: 'Ver Perfil',
    ctaLink: 'profile',
    color: 'purple',
    active: true,
    order: 3,
  },
];

interface BannerCarouselProps {
  onNavigate?: (view: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Busca banners do Firestore
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(
          collection(db, 'banners'),
          where('active', '==', true),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
          setBanners(data);
        }
        // Se vazio, mantém os DEFAULT_BANNERS
      } catch (err) {
        console.log('Usando banners padrão:', err);
        // Mantém DEFAULT_BANNERS
      }
    };
    fetchBanners();
  }, []);

  // Auto-rotação
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goTo('next');
    }, 5000);
  };

  useEffect(() => {
    if (banners.length > 1) startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [banners, current]);

  const goTo = (dir: 'next' | 'prev' | number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setCurrent(prev => {
      if (typeof dir === 'number') return dir;
      if (dir === 'next') return (prev + 1) % banners.length;
      return (prev - 1 + banners.length) % banners.length;
    });

    startInterval();
  };

  if (banners.length === 0) return null;

  const banner = banners[current];
  const colors = COLOR_MAP[banner.color] ?? COLOR_MAP['blue'];

  return (
    <div className="relative w-full mb-6 rounded-2xl overflow-hidden shadow-md select-none" style={{ minHeight: '110px' }}>
      {/* Slide */}
      <div
        className={`bg-gradient-to-r ${colors.bg} transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Decoração de fundo */}
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${colors.accent} -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none`} />
        <div className={`absolute bottom-0 left-20 w-24 h-24 rounded-full ${colors.accent} translate-y-1/2 blur-xl pointer-events-none`} />

        <div className="relative flex items-center gap-4 px-5 py-4">
          {/* Ícone de Dica */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.accent} flex items-center justify-center backdrop-blur-sm`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight mb-0.5 truncate">{banner.title}</p>
            <p className="text-white/80 text-xs leading-snug line-clamp-2">{banner.description}</p>
          </div>

          {/* CTA */}
          {banner.ctaText && (
            <button
              onClick={() => {
                if (banner.ctaLink && onNavigate) onNavigate(banner.ctaLink as any);
              }}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm ${colors.cta}`}
            >
              {banner.ctaText}
            </button>
          )}
        </div>

        {/* Barra inferior: dots + contador */}
        {banners.length > 1 && (
          <div className="flex items-center justify-between px-5 pb-3">
            <div className="flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goTo('prev')} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-white/50 text-[10px] font-medium">{current + 1}/{banners.length}</span>
              <button onClick={() => goTo('next')} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};