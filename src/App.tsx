import React, { useState, useEffect, useRef } from 'react';
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './components/LegalDocuments';
import { BusinessProfile } from './components/BusinessProfile';
import { TrialStatusBanner } from './components/TrialStatusBanner';
import { isAdmin } from './adminConfig';
import { User } from 'firebase/auth';
import { db } from './firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthChange, logout } from './authService';
import { createOrUpdateUser } from './firestoreService';
import { PostGenerator } from './components/PostGenerator';
import { ReviewResponder } from './components/ReviewResponder';
import { BusinessConsultant } from './components/BusinessConsultant';
import FaqGenerator from './components/FaqGenerator';
import { Login } from './components/Login';
import { Footer } from './components/Footer';
import { FounderBadge } from './components/FounderBadge';
import { AppView, UserProfile } from './types';
import { getUserPlan, canUseApp, UserPlan } from './planService';
import { ExpiredTrialBanner } from './components/TrialAlert';
import { CheckoutModal } from './components/CheckoutModal';
import { auth } from './firebaseConfig';
import { AdminFounders } from './pages/AdminFounders';
import { BannerCarousel } from './components/BannerCarousel';

const LOGO_URL = 'https://i.postimg.cc/NG1M7wXY/maps-guru-logo.png';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('posts');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [founderNumber, setFounderNumber] = useState<number | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'doubt' | 'other'>('feature');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const whatsappNumber = '5511957055256';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
        setShowFeedbackForm(false);
      }
    };
    if (supportOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [supportOpen]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await createOrUpdateUser(firebaseUser);
        const plan = await getUserPlan(firebaseUser.uid);
        setUserPlan(plan);
        if (plan?.isFounder) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setFounderNumber(userSnap.data().founderNumber || null);
          }
        }
        setUser({
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.displayName?.charAt(0).toUpperCase() || 'U',
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
        setUserPlan(null);
        setFounderNumber(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userPlan) {
      console.log('===== DEBUG USER PLAN =====');
      console.log('Plan:', userPlan.plan);
      console.log('Status:', userPlan.subscriptionStatus);
      console.log('Is Founder:', userPlan.isFounder);
      console.log('Trial Ends:', userPlan.trialEndsAt);
      console.log('Can Use App:', canUseApp(userPlan));
      console.log('==========================');
    }
  }, [userPlan]);

  const handleLogin = async (firebaseUser: User) => {
    await createOrUpdateUser(firebaseUser);
    const plan = await getUserPlan(firebaseUser.uid);
    setUserPlan(plan);
    if (plan?.isFounder) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setFounderNumber(userSnap.data().founderNumber || null);
      }
    }
    setUser({
      name: firebaseUser.displayName || 'Usuário',
      email: firebaseUser.email || '',
      avatar: firebaseUser.displayName?.charAt(0).toUpperCase() || 'U',
      photoURL: firebaseUser.photoURL || undefined
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setUserPlan(null);
      setFounderNumber(null);
      setCurrentView('posts');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Estou usando o MapsGuru e gostaria de falar com o suporte.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    setSupportOpen(false);
  };

  const handleSubmitFeedback = async () => {
    try {
      await addDoc(collection(db, 'feedbacks'), {
        type: feedbackType,
        message: feedbackMessage,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'não informado',
        userName: auth.currentUser?.displayName || 'não informado',
        timestamp: serverTimestamp(),
        status: 'novo'
      });
      const typeLabels = { bug: 'Bug/Erro', feature: 'Sugestão de Feature', doubt: 'Dúvida', other: 'Outro' };
      const msg = encodeURIComponent(`📝 *Feedback Maps*\n\n*Tipo:* ${typeLabels[feedbackType]}\n*Usuário:* ${auth.currentUser?.email || 'não informado'}\n\n*Mensagem:*\n${feedbackMessage}`);
      window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedbackForm(false);
        setFeedbackSubmitted(false);
        setFeedbackMessage('');
        setFeedbackType('feature');
        setSupportOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente!');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'posts':        return <PostGenerator />;
      case 'reviews':      return <ReviewResponder />;
      case 'faq':          return <FaqGenerator />;
      case 'consultation': return <BusinessConsultant />;
      case 'profile':      return <BusinessProfile />;
      case 'privacy':      return <PrivacyPolicy />;
      case 'terms':        return <TermsOfService />;
      case 'cookies':      return <CookiePolicy />;
      case 'admin':        return <AdminFounders />;
      default:             return <PostGenerator />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'posts':        return 'Estúdio de Criação';
      case 'reviews':      return 'Gestão de Reviews';
      case 'faq':          return 'Perguntas Frequentes (FAQ)';
      case 'consultation': return 'Consultoria Estratégica';
      case 'profile':      return 'Perfil do Negócio';
      case 'admin':        return '🛡️ Painel Admin';
      default:             return 'Estúdio de Criação';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Topo sidebar - logo real */}
        <div className="flex items-center gap-3 px-6 h-24 border-b border-slate-800">
          <img
            src={LOGO_URL}
            alt="MapsGuru"
            className="h-9 w-auto object-contain"
          />
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu de navegação */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Criação de Conteúdo</p>
          <nav className="space-y-1">
            <button onClick={() => navigateTo('posts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'posts' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span className="font-medium">Criar Post & Mídia</span>
            </button>
            <button onClick={() => navigateTo('reviews')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'reviews' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <span className="font-medium">Responder Reviews</span>
            </button>
            <button onClick={() => navigateTo('faq')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'faq' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-medium">Gerador de FAQ</span>
            </button>
          </nav>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Estratégia</p>
          <nav className="space-y-1">
            <button onClick={() => navigateTo('consultation')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'consultation' ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <span className="font-medium">Consultor IA</span>
            </button>
            {user && isAdmin(user.email) && (
              <button onClick={() => navigateTo('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'admin' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="font-medium">Admin Fundadores</span>
              </button>
            )}
          </nav>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Configurações</p>
          <nav className="space-y-1">
            <button onClick={() => navigateTo('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="font-medium">Perfil do Negócio</span>
            </button>

            {/* Suporte & Feedback */}
            <div ref={supportRef} className="relative">
              <button onClick={() => { setSupportOpen(!supportOpen); setShowFeedbackForm(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:text-white hover:bg-slate-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span className="font-medium">Suporte & Feedback</span>
                <span className="ml-auto text-[10px] font-bold bg-orange-500 text-white rounded-full px-2 py-0.5">BETA</span>
              </button>

              {supportOpen && !showFeedbackForm && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">Central de Suporte</h3>
                  <p className="text-xs text-gray-500 mb-3">Versão beta — fale direto com o criador 🚀</p>
                  <div className="space-y-2">
                    <button onClick={openWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all flex items-center gap-3">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <div className="text-left"><p className="text-sm font-bold">Falar no WhatsApp</p><p className="text-xs opacity-80">Resposta rápida e direta</p></div>
                    </button>
                    <button onClick={() => setShowFeedbackForm(true)} className="w-full bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-all flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </div>
                      <div className="text-left"><p className="text-sm font-bold text-gray-800">Enviar Feedback</p><p className="text-xs text-gray-500">Bug, sugestão ou dúvida</p></div>
                    </button>
                  </div>
                  <div className="mt-3 p-2.5 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-xs text-orange-800">Seu feedback é essencial para melhorarmos o MapsGuru! 🚀</p>
                  </div>
                </div>
              )}

              {showFeedbackForm && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-slate-200">
                  {feedbackSubmitted ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">Feedback Enviado!</h3>
                      <p className="text-xs text-gray-500">Obrigado por nos ajudar a melhorar 🎉</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">Enviar Feedback</h3>
                        <button onClick={() => setShowFeedbackForm(false)} className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Tipo</label>
                          <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value as any)} className="w-full px-3 py-2 bg-slate-100 rounded-xl text-gray-800 text-sm focus:outline-none">
                            <option value="feature">💡 Sugestão de Feature</option>
                            <option value="bug">🐛 Reportar Bug/Erro</option>
                            <option value="doubt">❓ Dúvida</option>
                            <option value="other">💬 Outro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Mensagem</label>
                          <textarea value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} placeholder="Descreva seu feedback..." rows={3} className="w-full px-3 py-2 bg-slate-100 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:outline-none resize-none" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setShowFeedbackForm(false)} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm font-bold rounded-xl transition-all">Cancelar</button>
                          <button onClick={handleSubmitFeedback} disabled={!feedbackMessage.trim()} className={`flex-1 px-3 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${feedbackMessage.trim() ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            Enviar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Rodapé sidebar - usuário */}
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">{user.avatar}</div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate w-24">{user.name}</p>
                  <p className="text-xs text-slate-400">{userPlan?.isFounder ? 'Fundador' : 'Plano Pro'}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white" title="Sair">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9" /></svg>
              </button>
            </div>
            {userPlan?.isFounder && (
              <div className="mt-2 pt-2 border-t border-slate-700">
                <FounderBadge founderNumber={founderNumber || undefined} variant="sidebar" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">

        {/* HEADER com logo real */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <img
              src={LOGO_URL}
              alt="MapsGuru"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-4 border-r border-slate-200 pr-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Módulo Atual</p>
              <p className="text-sm font-bold text-slate-700">{getTitle()}</p>
            </div>
            {userPlan?.isFounder && (
              <div className="hidden sm:block">
                <FounderBadge founderNumber={founderNumber || undefined} variant="compact" />
              </div>
            )}
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors focus:outline-none" aria-label="Menu Principal">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col scroll-smooth">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <BannerCarousel onNavigate={navigateTo} />
              {userPlan && (
                <TrialStatusBanner userPlan={userPlan} onUpgrade={() => setShowUpgradeModal(true)} />
              )}
              {userPlan && !canUseApp(userPlan) && (
                <ExpiredTrialBanner onUpgrade={() => setShowUpgradeModal(true)} />
              )}
              {renderContent()}
            </div>
          </div>
          <Footer onNavigate={navigateTo} currentView={currentView} />
        </main>
      </div>

      {userPlan && !canUseApp(userPlan) && (
        <ExpiredTrialBanner onUpgrade={() => setShowUpgradeModal(true)} />
      )}
      {showUpgradeModal && user && (
        <CheckoutModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={auth.currentUser?.uid || ''}
          userEmail={user.email}
          userName={user.name}
        />
      )}
    </div>
  );
}

export default App;