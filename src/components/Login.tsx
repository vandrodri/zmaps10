import React, { useState } from 'react';
import { signInWithGoogle } from '../authService';
import { User } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError('Falha ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center animate-fade-in-up">
        
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo ao GBP Pro</h1>
        <p className="text-slate-500 mb-8">
          Sua suíte completa de Inteligência Artificial para gestão de Google Business Profile.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-white text-slate-700 border border-slate-300 font-medium py-3 px-4 rounded-xl transition-all shadow-sm group ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-slate-50'
            }`}
        >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5"
                />
                <span>Entrar com Google</span>
              </>
            )}
        </button>

        <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400">
                Ao entrar, você concorda com nossos <a href="#" className="underline">Termos de Serviço</a>.
            </p>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-slate-400">
        &copy; 2024 GBP Pro Analyzer AI. Powered by Gemini.
      </p>
    </div>
  );
};