import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const CHECKLIST_STORAGE_KEY = 'zmaps_onboarding_checklist';

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const OnboardingChecklist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'tour',
      title: 'Fazer Tour Guiado',
      description: 'Conheça todas as funcionalidades',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      completed: false
    },
    {
      id: 'connect',
      title: 'Conectar Google Meu Negócio',
      description: 'Vincule sua conta do Google',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      completed: false
    },
    {
      id: 'first-post',
      title: 'Criar Primeiro Post',
      description: 'Gere seu primeiro conteúdo com IA',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      completed: false
    },
    {
      id: 'first-review',
      title: 'Responder Primeira Avaliação',
      description: 'Use a IA para responder reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      completed: false
    },
    {
      id: 'generate-faq',
      title: 'Gerar FAQs',
      description: 'Crie perguntas frequentes automaticamente',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      completed: false
    },
    {
      id: 'consultant',
      title: 'Consultar IA',
      description: 'Tire suas dúvidas com o consultor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      completed: false
    }
  ]);

  // Carregar progresso do localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            completed: parsed[item.id] || false
          }))
        );
      } catch (e) {
        console.error('Erro ao carregar progresso do checklist:', e);
      }
    }
  }, []);

  // Salvar progresso no localStorage
  const saveProgress = (updatedItems: ChecklistItem[]) => {
    const progress = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.completed;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(progress));
  };

  const toggleItem = (id: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      saveProgress(updatedItems);
      return updatedItems;
    });
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;
  const isComplete = completedCount === totalCount;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
          text-white rounded-full p-4 shadow-2xl transition-all duration-300
          ${isOpen ? 'scale-95' : 'scale-100 hover:scale-105'}
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        
        {/* Badge de Progresso */}
        {!isComplete && (
          <div className="absolute -top-1 -right-1 bg-[#34A853] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
            {completedCount}
          </div>
        )}
        
        {/* Badge de Completo */}
        {isComplete && (
          <div className="absolute -top-1 -right-1 bg-[#34A853] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel do Checklist */}
          <div className="absolute bottom-20 right-0 w-96 max-h-[600px] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-5 z-50 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Primeiros Passos</h3>
                  <p className="text-sm text-gray-500">{completedCount} de {totalCount} concluídos</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2.5 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#34A853] to-[#4CAF50] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">{Math.round(progress)}% completo</p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`
                    bg-gradient-to-br from-gray-100 to-gray-50 
                    rounded-xl p-3.5 cursor-pointer transition-all
                    shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)]
                    hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]
                    ${item.completed ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className={`
                      w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                      ${item.completed 
                        ? 'bg-[#34A853] shadow-md' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]'
                      }
                    `}>
                      {item.completed ? (
                        <CheckIcon />
                      ) : (
                        <div className="text-gray-400">
                          {item.icon}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`
                        font-semibold text-sm 
                        ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}
                      `}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Message */}
            {isComplete && (
              <div className="mt-4 p-3.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-bold">Parabéns! Você completou o onboarding! 🎉</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};