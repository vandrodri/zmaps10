import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";

// Login com Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    throw error;
  }
};

// Cadastro com Email/Senha
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Atualiza o perfil com o nome
    if (result.user) {
      await updateProfile(result.user, {
        displayName: name
      });
    }
    
    return result.user;
  } catch (error: any) {
    console.error("Erro ao criar conta:", error);
    
    // Mensagens de erro em português
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este email já está em uso.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    }
    
    throw new Error('Erro ao criar conta. Tente novamente.');
  }
};

// Login com Email/Senha
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    
    // Mensagens de erro em português
    if (error.code === 'auth/user-not-found') {
      throw new Error('Usuário não encontrado.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Senha incorreta.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Muitas tentativas. Tente novamente mais tarde.');
    }
    
    throw new Error('Erro ao fazer login. Verifique suas credenciais.');
  }
};

// Recuperação de senha
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    console.error("Erro ao enviar email de recuperação:", error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('Email não encontrado.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido.');
    }
    
    throw new Error('Erro ao enviar email. Tente novamente.');
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// Observador de autenticação
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};