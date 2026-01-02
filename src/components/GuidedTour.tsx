import React, { useState, useEffect } from 'react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="create-post"]',
    title: 'Criar Posts & Mídia',
    description: 'Gere textos profissionais e imagens com IA em poucos cliques. Perfeito para seu Google Business Profile!',
    position: 'right'
  },
  {
    target: '[data-tour="reviews"]',
    title: 'Responder Reviews',
    description: 'Cole a avaliação e escolha o tom. A IA cria respostas personalizadas que encantam seus clientes!',
    position: 'right'
  },
  {
    target: '[data-tour="faq"]',
    title: 'Gerador de FAQ',
    description: 'Crie perguntas frequentes automaticamente baseadas no seu negócio. Economia de tempo garantida!',
    position: 'right'
  },
  {
    target: '[data-tour="consultant"]',
    title: 'Consultor IA',
    description: 'Receba estratégias e insights personalizados para fazer seu negócio crescer no Google Maps!',
    position: 'right'
  }
];

interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const step = TOUR_STEPS[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        
        let top = rect.top;
        let left = rect.left + rect.width + 20;
        
        if (step.position === 'bottom') {
          top = rect.bottom + 10;
          left = rect.left;
        }
        
        setTooltipPosition({ top, left });
        
        // Highlight do elemento
        element.classList.add('tour-highlight');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={handleSkip} />
      
      {/* Tooltip */}
      <div 
        className="fixed z-[9999] bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-scale-in"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Passo {currentStep + 1} de {TOUR_STEPS.length}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{step.title}</h3>
          </div>
          <button 
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{step.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-purple-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {!isLastStep && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold text-sm"
              >
                Pular
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-md"
            >
              {isLastStep ? 'Finalizar 🎉' : 'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};