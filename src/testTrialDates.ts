import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Alterar data de trial para testes
export const setTrialDate = async (userId: string, daysFromNow: number) => {
  try {
    const userRef = doc(db, "users", userId);
    
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysFromNow);
    
    await updateDoc(userRef, {
      trialEndsAt: newDate
    });
    
    console.log(`✅ Trial alterado para ${daysFromNow} dias a partir de agora`);
    console.log(`📅 Nova data: ${newDate.toLocaleString('pt-BR')}`);
    
    return newDate;
  } catch (error) {
    console.error("❌ Erro ao alterar trial:", error);
    throw error;
  }
};

// Atalhos para testes comuns
export const testScenarios = {
  // Mostra alerta laranja (2 dias restantes)
  alert2Days: (userId: string) => setTrialDate(userId, 2),
  
  // Mostra alerta vermelho urgente (1 dia restante)
  alert1Day: (userId: string) => setTrialDate(userId, 1),
  
  // Trial expirado (mostra banner de bloqueio)
  expired: (userId: string) => setTrialDate(userId, -1),
  
  // Volta ao normal (7 dias)
  reset: (userId: string) => setTrialDate(userId, 7)
};