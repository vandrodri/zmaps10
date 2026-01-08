import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackData {
  type: 'bug' | 'feature' | 'doubt' | 'other';
  message: string;
}

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: 'feature',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = '5511957055256'; // Formato internacional

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Estou usando o MapsGuru e gostaria de falar com o suporte.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    setIsOpen(false);
  };

  const handleSubmitFeedback = async () => {
    try {
      // Salvar no Firebase
      const feedbackData = {
        type: feedback.type,
        message: feedback.message,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'não informado',
        userName: auth.currentUser?.displayName || 'não informado',
        timestamp: serverTimestamp(),
        status: 'novo'
      };

      await addDoc(collection(db, 'feedbacks'), feedbackData);
      console.log('Feedback salvo no Firebase com sucesso!');

      // Enviar também pelo WhatsApp para notificação instantânea
      const typeLabels = {
        bug: 'Bug/Erro',
        feature: 'Sugestão de Feature',
        doubt: 'Dúvida',
        other: 'Outro'
      };
      
      const message = encodeURIComponent(
        `📝 *Feedback Maps*\n\n` +
        `*Tipo:* ${typeLabels[feedback.type]}\n` +
        `*Usuário:* ${auth.currentUser?.email || 'não informado'}\n\n` +
        `*Mensagem:*\n${feedback.message}`
      );
      
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      
      setSubmitted(true);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setFeedback({ type: 'feature', message: '' });
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente!');
    }
  };

  return (
    <div className="fixed bottom-6 right-28 z-50">
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
          text-white rounded-full p-4 shadow-2xl transition-all duration-300
          ${isOpen ? 'scale-95' : 'scale-100 hover:scale-105'}
        `}
        title="Suporte & Feedback"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        
        {/* Badge "Beta" */}
        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 shadow-lg border-2 border-white">
          BETA
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !showForm && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute bottom-20 right-0 w-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-5 z-50 animate-scale-in">
            
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Central de Suporte</h3>
              <p className="text-xs text-gray-600">
                Estamos em versão beta! Fale direto com o criador 🚀
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              
              {/* WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl transition-all shadow-lg flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">Falar no WhatsApp</p>
                  <p className="text-xs opacity-90">Resposta rápida e direta</p>
                </div>
                <svg className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Formulário de Feedback */}
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-br from-gray-100 to-gray-50 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] p-4 rounded-xl transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-gray-800">Enviar Feedback</p>
                  <p className="text-xs text-gray-600">Bug, sugestão ou dúvida</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

            </div>

            {/* Info Beta */}
            <div className="mt-4 p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-orange-800">
                  Seu feedback é essencial para melhorarmos o MapsGuru! 🚀
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulário de Feedback */}
      {showForm && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowForm(false)}
          />
          
          <div className="absolute bottom-20 right-0 w-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl p-5 z-50 animate-scale-in">
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Feedback Enviado!</h3>
                <p className="text-sm text-gray-600">Obrigado por nos ajudar a melhorar 🎉</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Enviar Feedback</h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Tipo de Feedback */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Feedback</label>
                    <select
                      value={feedback.type}
                      onChange={(e) => setFeedback(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-gray-800 focus:outline-none font-medium"
                    >
                      <option value="feature">💡 Sugestão de Feature</option>
                      <option value="bug">🐛 Reportar Bug/Erro</option>
                      <option value="doubt">❓ Dúvida</option>
                      <option value="other">💬 Outro</option>
                    </select>
                  </div>

                  {/* Mensagem */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem</label>
                    <textarea
                      value={feedback.message}
                      onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Descreva seu feedback aqui..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none font-medium resize-none"
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] text-gray-700 font-bold rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.message.trim()}
                      className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        feedback.message.trim()
                          ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};