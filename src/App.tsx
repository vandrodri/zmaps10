import React, { useState, useEffect } from 'react';
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './components/LegalDocuments';
import { SupportWidget } from './components/SupportWidget';
import { BusinessProfile } from './components/BusinessProfile';
import { BusinessSetupModal, BusinessSetupData } from './components/BusinessSetupModal';
import { WelcomeModal } from './components/WelcomeModal';
import { GuidedTour } from './components/GuidedTour';
import { OnboardingChecklist } from './components/OnboardingChecklist';
import { TrialStatusBanner } from './components/TrialStatusBanner';
import { isAdmin } from './adminConfig';
import { User } from 'firebase/auth';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; 
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
import { getUserPlan, getDaysRemaining, shouldShowAlert, canUseApp, UserPlan } from './planService';
import { TrialAlert, ExpiredTrialBanner } from './components/TrialAlert';
import { CheckoutModal } from './components/CheckoutModal';
import { auth } from './firebaseConfig';
import { AdminFounders } from './pages/AdminFounders';

const App: React.FC = () => {
  // Estados
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('posts');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [founderNumber, setFounderNumber] = useState<number | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
const [showTour, setShowTour] = useState(false);
const [showBusinessSetup, setShowBusinessSetup] = useState(false);

  // useEffect para autenticação e plano
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        await createOrUpdateUser(firebaseUser);
        
        const plan = await getUserPlan(firebaseUser.uid);
        setUserPlan(plan);
        
        // Busca informações de fundador
        if (plan?.isFounder) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFounderNumber(userData.founderNumber || null);
          }
        }
        
        setUser({
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.displayName?.charAt(0).toUpperCase() || 'U',
          photoURL: firebaseUser.photoURL || undefined
        });
        // ✅ ADICIONE AQUI:
// Verificar se é primeira vez
const userRef = doc(db, "users", firebaseUser.uid);
const userSnap = await getDoc(userRef);
if (userSnap.exists()) {
  const userData = userSnap.data();
  // Se não tem campo hasSeenOnboarding, mostra o modal
  if (!userData.hasSeenOnboarding) {
    setShowWelcomeModal(true);
  }
}
      } else {
        setUser(null);
        setUserPlan(null);
        setFounderNumber(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // 🐛 DEBUG TEMPORÁRIO - COLOCAR AQUI EMBAIXO
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

  // Funções
  const handleLogin = async (firebaseUser: User) => {
    await createOrUpdateUser(firebaseUser);
    const plan = await getUserPlan(firebaseUser.uid);
    setUserPlan(plan);
    
    // Busca informações de fundador
    if (plan?.isFounder) {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFounderNumber(userData.founderNumber || null);
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
// ✅ ADICIONE AQUI - Funções de Onboarding
const handleCloseWelcome = async () => {
  setShowWelcomeModal(false);
  setShowBusinessSetup(true); // 👈 Abre o setup do negócio
};

// 
const handleBusinessSetupComplete = async (data: BusinessSetupData) => {
  setShowBusinessSetup(false);
  
  // Salvar no Firebase
  if (auth.currentUser) {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        businessName: data.businessName,
        gbpLink: data.gbpLink,
        businessSetupCompleted: true
      });
      console.log('Dados do negócio salvos!');
    } catch (error) {
      console.error('Erro ao salvar dados do negócio:', error);
    }
  }
};

const handleBusinessSetupSkip = () => {
  setShowBusinessSetup(false);
};

const handleStartTour = () => {
  setShowTour(true);
};

const handleCompleteTour = async () => {
  setShowTour(false);
  

  }

const renderContent = () => {
  switch (currentView) {
    case 'posts':
      return <PostGenerator />;
    case 'reviews':
      return <ReviewResponder />;
    case 'faq':
      return <FaqGenerator />;
    case 'consultation':
      return <BusinessConsultant />;
    case 'profile':
      return <BusinessProfile />;
    case 'privacy':
      return <PrivacyPolicy />;
    case 'terms':
      return <TermsOfService />;
    case 'cookies':
      return <CookiePolicy />;  // 👈 ADICIONAR ESSA LINHA!
    case 'admin':
      return <AdminFounders />;
    default:
      return <PostGenerator />;
  }
};

  const getTitle = () => {
  switch(currentView) {
    case 'posts': return 'Estúdio de Criação';
    case 'reviews': return 'Gestão de Reviews';
    case 'faq': return 'Perguntas Frequentes (FAQ)';
    case 'consultation': return 'Consultoria Estratégica';
    case 'profile': return 'Perfil do Negócio';
    case 'admin': return '🛡️ Painel Admin';
    default: return 'Estúdio de Criação';
  }
};

  // Early returns
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

  // Return principal
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
  fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
  md:relative md:translate-x-0
  ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
  {/* TOPO DO SIDEBAR - Logo MapsGuru */}
  <div className="flex items-center gap-3 px-6 h-24 border-b border-slate-800">
    {/* Logo Compacto */}
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
    
    <div>
      <span className="block text-xl font-bold tracking-tight leading-none text-white">MapsGuru</span>
      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI Suite Pro</span>
    </div>
    
    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-slate-400">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  {/* MENU DE NAVEGAÇÃO */}
  <div className="px-4 py-6 flex-1 overflow-y-auto">
    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Criação de Conteúdo</p>
    <nav className="space-y-1">
      <button 
        data-tour="create-post"
        onClick={() => navigateTo('posts')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'posts' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="font-medium">Criar Post & Mídia</span>
      </button>

      <button 
        data-tour="reviews"
        onClick={() => navigateTo('reviews')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'reviews' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="font-medium">Responder Reviews</span>
      </button>

      <button 
        data-tour="faq"
        onClick={() => navigateTo('faq')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'faq' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Gerador de FAQ</span>
      </button>
    </nav>

    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Estratégia</p>
    <nav className="space-y-1">
      <button 
        data-tour="consultant"
        onClick={() => navigateTo('consultation')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'consultation' ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="font-medium">Consultor IA</span>
      </button>
  
      {/* Botão Admin - só aparece para admins */}
      {user && isAdmin(user.email) && (
        <button 
          onClick={() => navigateTo('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'admin' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-medium">Admin Fundadores</span>
        </button>
      )}
    </nav>
    
    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Configurações</p>
    <nav className="space-y-1">
      <button 
        onClick={() => navigateTo('profile')}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="font-medium">Perfil do Negócio</span>
      </button>
    </nav>
  </div>

  {/* RODAPÉ - Usuário */}
  <div className="mt-auto p-4 border-t border-slate-800">
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
              {user.avatar}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate w-24">{user.name}</p>
            <p className="text-xs text-slate-400">
              {userPlan?.isFounder ? 'Fundador' : 'Plano Pro'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white" title="Sair">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
      
      {/* BADGE DE FUNDADOR */}
      {userPlan?.isFounder && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <FounderBadge founderNumber={founderNumber || undefined} variant="sidebar" />
        </div>
      )}
    </div>
  </div>
</aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm transition-all">
  
  {/* LADO ESQUERDO: Logo MapsGuru + Slogan */}
  <div className="flex items-center gap-3">
    {/* ÍCONE MapsGuru */}
    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-md transition-all">
      {/* Pin + Estrela (SVG inline) */}
      <svg
        width="24"
        height="24"
        className="md:w-7 md:h-7"
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
    
    {/* Nome + Slogan */}
    <div className="flex flex-col leading-tight">
      <h1 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight">
        MapsGuru
      </h1>
      <p className="text-[10px] md:text-[11px] font-medium text-slate-500">
        Cliente procura, você aparece
      </p>
    </div>
  </div>

  {/* LADO DIREITO: Módulo Atual + Badges + Menu */}
  <div className="flex items-center gap-4">
    
    <div className="hidden md:block text-right mr-4 border-r border-slate-200 pr-6">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Módulo Atual</p>
      <p className="text-sm font-bold text-slate-700">{getTitle()}</p>
    </div>

    {/* Badge compacto no header (mobile) */}
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

    <button 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors focus:outline-none"
      aria-label="Menu Principal"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  </div>
</header>

        <main className="flex-1 overflow-y-auto flex flex-col scroll-smooth">
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Banner de Status do Trial */}
{userPlan && (
  <TrialStatusBanner 
    userPlan={userPlan}
    onUpgrade={() => setShowUpgradeModal(true)}
  />
)}
              
              {/* Banner de Trial Expirado */}
              {userPlan && !canUseApp(userPlan) && (
                <ExpiredTrialBanner 
                  onUpgrade={() => setShowUpgradeModal(true)}
                />
              )}
            

              {renderContent()}

            </div>
          </div>
          <Footer onNavigate={navigateTo} />
        </main>

      </div>
      
      {/* Banner de Trial Expirado (Overlay) */}
      {userPlan && !canUseApp(userPlan) && (
        <ExpiredTrialBanner 
          onUpgrade={() => setShowUpgradeModal(true)}
        />
      )}
      
      {/* Modal de Checkout */}
      {showUpgradeModal && user && (
        <CheckoutModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={auth.currentUser?.uid || ''}
          userEmail={user.email}
          userName={user.name}
        />
      )}
      {/* Modais de Onboarding */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseWelcome}
        onStartTour={handleStartTour}
        userName={user?.name || 'Usuário'}
      />
      <BusinessSetupModal
  isOpen={showBusinessSetup}
  onComplete={handleBusinessSetupComplete}
  onSkip={handleBusinessSetupSkip}
  userName={user?.name || 'Usuário'}
/>
      <GuidedTour
        isActive={showTour}
        onComplete={handleCompleteTour}
      />
      <OnboardingChecklist /> {/* 👈 Só isso! */}
      <SupportWidget />
  </div>
    );
}
      
      export default App;
