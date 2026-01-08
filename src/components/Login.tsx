import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '../authService';
import { User } from 'firebase/auth';
import NeumorphicInput from './NeumorphicInput';
import NeumorphicButton from './NeumorphicButton';

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError('Falha ao fazer login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const user = await signInWithEmail(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    
    try {
      const user = await signUpWithEmail(email, password, name);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await resetPassword(email);
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setTimeout(() => {
        setView('LOGIN');
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email.');
    } finally {
      setLoading(false);
    }
  };

  const renderGoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f0f2f5]">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-[#f0f2f5] p-8 md:p-12 rounded-[2.5rem] shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
  <div className="flex justify-center mb-6">
    {/* Logo MapsGuru */}
    <div className="w-12 h-12 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-300 border border-white/20">
      <svg
        width="28"
        height="28"
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
  </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {view === 'LOGIN' && 'Bem-vindo'}
            {view === 'SIGNUP' && 'Criar conta'}
            {view === 'FORGOT_PASSWORD' && 'Recuperar senha'}
          </h1>
          <p className="text-gray-500 mt-2">
            {view === 'LOGIN' && 'Faça login para continuar no MapsGuru'}
            {view === 'SIGNUP' && 'Junte-se a nós hoje mesmo'}
            {view === 'FORGOT_PASSWORD' && 'Enviaremos um link de recuperação'}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-[#f0f2f5] rounded-2xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-l-4 border-[#EA4335]">
            <p className="text-[#EA4335] text-sm font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-[#f0f2f5] rounded-2xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.5),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] border-l-4 border-[#34A853]">
            <p className="text-[#34A853] text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Google Social Login */}
        {view !== 'FORGOT_PASSWORD' && (
          <div className="mb-8">
            <NeumorphicButton 
              variant="google" 
              fullWidth 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {renderGoogleIcon()}
              Continuar com Google
            </NeumorphicButton>
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-[#f0f2f5] shadow-[inset_0_1px_2px_rgba(163,177,198,0.3)]" />
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase">ou e-mail</span>
              <div className="flex-grow h-px bg-[#f0f2f5] shadow-[inset_0_1px_2px_rgba(163,177,198,0.3)]" />
            </div>
          </div>
        )}

        {/* Main Form */}
        <form 
          onSubmit={
            view === 'LOGIN' ? handleEmailLogin :
            view === 'SIGNUP' ? handleSignUp :
            handleResetPassword
          } 
          className="space-y-6"
        >
          {view === 'SIGNUP' && (
            <NeumorphicInput 
              label="Nome Completo" 
              placeholder="Seu nome" 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          
          <NeumorphicInput 
            label="E-mail" 
            placeholder="exemplo@email.com" 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {view !== 'FORGOT_PASSWORD' && (
            <>
              <NeumorphicInput 
                label="Senha" 
                placeholder="••••••••" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {view === 'SIGNUP' && (
                <NeumorphicInput 
                  label="Confirmar Senha" 
                  placeholder="••••••••" 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}
            </>
          )}

          {view === 'LOGIN' && (
            <div className="flex justify-end">
              <NeumorphicButton 
                type="button" 
                variant="text" 
                className="text-xs text-blue-600 hover:text-blue-700 font-medium" 
                onClick={() => {
                  setView('FORGOT_PASSWORD');
                  setError(null);
                  setEmail('');
                }}
              >
                Esqueceu a senha?
              </NeumorphicButton>
            </div>
          )}

          <NeumorphicButton 
            type="submit" 
            fullWidth 
            variant="primary" 
            disabled={loading}
            className={loading ? "opacity-70 cursor-not-allowed" : ""}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </div>
            ) : (
              view === 'LOGIN' ? 'Entrar' : view === 'SIGNUP' ? 'Cadastrar' : 'Enviar Link'
            )}
          </NeumorphicButton>
        </form>

        {/* Footer Navigation */}
        <div className="mt-10 text-center">
          {view === 'LOGIN' ? (
            <p className="text-gray-500 text-sm">
              Não tem uma conta?{' '}
              <button 
                onClick={() => {
                  setView('SIGNUP');
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Criar agora
              </button>
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Já possui uma conta?{' '}
              <button 
                onClick={() => {
                  setView('LOGIN');
                  setError(null);
                  setSuccess(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Voltar para login
              </button>
            </p>
          )}
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-6 text-center">
          <a 
            href="#" 
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Política de Privacidade
          </a>
        </div>

        {/* Bottom Accent Decor - Google Colors */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 flex rounded-b-[2.5rem] overflow-hidden">
          <div className="h-full flex-1 bg-[#4285F4]" />
          <div className="h-full flex-1 bg-[#EA4335]" />
          <div className="h-full flex-1 bg-[#FBBC05]" />
          <div className="h-full flex-1 bg-[#34A853]" />
        </div>
      </div>
    </div>
  );
};